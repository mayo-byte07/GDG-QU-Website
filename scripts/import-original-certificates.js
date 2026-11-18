import { createClient } from "@supabase/supabase-js";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { resolve, basename } from "node:path";

const root = resolve(import.meta.dirname, "..");
const parseEnv = (file) => {
  if (!existsSync(file)) return {};
  return Object.fromEntries(readFileSync(file, "utf8").split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    return match ? [[match[1], match[2].replace(/^['"]|['"]$/g, "")]] : [];
  }));
};
const env = { ...parseEnv(resolve(root, ".env")), ...process.env };
const supabaseUrl = env.SUPABASE_URL;
const secretKey = env.SUPABASE_SECRET_KEY;
const siteUrl = (env.PUBLIC_SITE_URL || "https://gdg-quantumuniversity.me").replace(/\/$/, "");
const eventId = "a9c417d3-d0c0-48a6-9d2b-2bbd1a8350a9";
const issuer = { issuer_name: "Dr. Ashish Saini", issuer_qid: "QU012223654", issuer_email: "gdsc@quantumuniversity.edu.in" };
const mappingPath = resolve(root, "tmp/pdfs/certificate-qid-mapping.csv");
const sourceDir = resolve(process.env.CERTIFICATE_PDF_DIR || "C:/Users/xlots/Downloads/7994411896748098407");
const bucket = "certificate-files";

if (!supabaseUrl || !secretKey) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are required in the root .env.");
if (!existsSync(mappingPath)) throw new Error(`Mapping CSV not found: ${mappingPath}`);

const parseCsv = (text) => {
  const rows = []; let row = []; let field = ""; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted && ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { row.push(field); field = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(field); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [headers, ...data] = rows;
  return data.filter((r) => r.some(Boolean)).map((r) => Object.fromEntries(headers.map((h, i) => [h.replace(/^\uFEFF/, ""), r[i] || ""])));
};

const rows = parseCsv(readFileSync(mappingPath, "utf8"));
if (rows.length !== 200 || new Set(rows.map((r) => r.qid)).size !== rows.length || new Set(rows.map((r) => r.certificate_id)).size !== rows.length) {
  throw new Error("Expected 200 rows with distinct QIDs and certificate IDs.");
}
const supabase = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: event, error: eventError } = await supabase.from("certificate_events").select("id,name,status,issue_date").eq("id", eventId).single();
if (eventError) throw new Error(`Cannot read event (check migration and project credentials): ${eventError.message}`);
if (event.status === "draft") throw new Error("Event must be published before importing certificates.");
if (event.issue_date !== "2026-11-18") throw new Error(`Event issue date is ${event.issue_date}, expected 2026-11-18.`);

// Do not import unless public verification responds from the application API.
const probeId = "GDGQU-2026-0000000000000000";
const probe = await fetch(`${siteUrl}/api/certificates/verify/${probeId}`);
if (!(probe.headers.get("content-type") || "").includes("application/json")) {
  throw new Error(`Verification API is not deployed at ${siteUrl} (HTTP ${probe.status}); import stopped before uploading any PDFs.`);
}

const results = [];
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  if (!r.qid || !r.recipient_name || !/^GDGQU-2026-[A-F0-9]{16}$/.test(r.certificate_id)) throw new Error(`Invalid mapping row ${i + 2}.`);
  const filePath = resolve(sourceDir, basename(r.certificate_file));
  if (!existsSync(filePath)) throw new Error(`Missing source PDF: ${filePath}`);
  const storagePath = `certificates/2026/${eventId}/${r.certificate_id}.pdf`;
  const { data: existing, error: lookupError } = await supabase.from("certificates").select("id,recipient_name,recipient_qid,pdf_storage_path,generation_status").eq("certificate_id", r.certificate_id).maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) {
    if (existing.recipient_qid !== r.qid || existing.recipient_name !== r.recipient_name) throw new Error(`ID collision or mismatched existing row: ${r.certificate_id}`);
    results.push({ certificate_id: r.certificate_id, qid: r.qid, status: "already_imported" });
    continue;
  }
  const bytes = readFileSync(filePath);
  const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, bytes, { contentType: "application/pdf", upsert: false });
  if (uploadError) throw new Error(`PDF upload failed for ${r.certificate_file}: ${uploadError.message}`);
  const { error: insertError } = await supabase.from("certificates").insert({
    certificate_id: r.certificate_id, recipient_name: r.recipient_name, recipient_qid: r.qid,
    recipient_email: null, event_id: eventId, template_id: null, category: "Participant",
    issue_date: "2026-11-18", status: "active", generation_status: "ready",
    pdf_storage_path: storagePath, ...issuer,
  });
  if (insertError) {
    await supabase.storage.from(bucket).remove([storagePath]);
    throw new Error(`Certificate record failed for ${r.certificate_id}: ${insertError.message}`);
  }
  results.push({ certificate_id: r.certificate_id, qid: r.qid, status: "imported" });
  if ((i + 1) % 10 === 0) console.log(`Imported ${i + 1}/200`);
}
const resultPath = resolve(root, "tmp/pdfs/certificate-import-results.csv");
const esc = (v) => `"${String(v).replaceAll('"', '""')}"`;
const output = ["certificate_id,qid,status,verification_url", ...results.map((r) => [r.certificate_id, r.qid, r.status, `${siteUrl}/verify/${r.certificate_id}`].map(esc).join(","))].join("\n");
await import("node:fs/promises").then(({ writeFile }) => writeFile(resultPath, output, "utf8"));
console.log(`Done: ${results.filter((r) => r.status === "imported").length} imported; ${results.filter((r) => r.status === "already_imported").length} already present.`);
console.log(`Results: ${resultPath}`);
