import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { supabase } from "../lib/supabase";
import { parseCsv as parseCsvFile } from "../lib/certificate-import";
import "./certificate-admin.css";

const api = async (path, token, options = {}) => {
  const { data: sessionData } = await supabase?.auth.getSession() || { data: {} };
  const currentToken = sessionData.session?.access_token || token;
  const response = await fetch(`/api/certificates/${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}), ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
};

const ADMIN_ROLES = ["super_admin", "certificate_manager", "event_manager", "viewer"];
const getAccessRole = (access) => {
  if (!ADMIN_ROLES.includes(access?.role)) {
    throw new Error("Your admin account did not return a valid role. Check that the certificate-management SQL setup has been applied in Supabase, then redeploy the project.");
  }
  return access.role;
};

export function CertificateLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      if (!supabase) throw new Error("Supabase is not configured.");
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      const access = await api("access", data.session.access_token);
      getAccessRole(access);
      navigate("/admin/certificates", { replace: true });
    } catch (e2) { setError(e2.message); }
    finally { setBusy(false); }
  };
  return <main className="cert-login"><form onSubmit={submit} className="cert-login-card"><span className="cert-kicker">GDG QU · CERTIFICATE ADMIN</span><h1>Sign in</h1><p>Use your authorized administrator account.</p><label>Email<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <p className="cert-error">{error}</p>}<button disabled={busy}>{busy ? "Checking access…" : "Continue"}</button></form></main>;
}

const NAV = ["Overview", "Issue", "Bulk generation", "Certificates", "Events", "Templates", "Activity", "Administrators"];
const roleCan = (role, action) => role === "super_admin" || role === "certificate_manager" || (role === "event_manager" && ["Issue", "Bulk generation", "Events"].includes(action));

export default function CertificateAdmin() {
  const navigate = useNavigate();
  const [token, setToken] = useState(""); const [role, setRole] = useState("");
  const [section, setSection] = useState("Overview"); const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const [dashboard, setDashboard] = useState(null); const [events, setEvents] = useState([]); const [templates, setTemplates] = useState([]);
  const refresh = useCallback(async (currentToken = token) => {
    if (!currentToken) return;
    try {
      setError("");
      const [d, e, t] = await Promise.all([api("dashboard", currentToken), api("events", currentToken), api("templates", currentToken)]);
      setDashboard(d); setEvents(e.events || []); setTemplates(t.templates || []);
    } catch (e) { setError(e.message); }
  }, [token]);
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!supabase) { setError("Supabase is not configured."); setLoading(false); return; }
      const { data } = await supabase.auth.getSession(); const currentToken = data.session?.access_token;
      if (!currentToken) { navigate("/admin/login", { replace: true }); return; }
      try {
        const access = await api("access", currentToken);
        if (!alive) return;
        setToken(currentToken);
        try {
          setRole(getAccessRole(access));
          await refresh(currentToken);
        } catch (accessError) {
          setError(accessError.message);
        }
      }
      catch (accessError) {
        await supabase.auth.signOut();
        if (alive) {
          setError(accessError.message);
          navigate("/admin/login", { replace: true });
        }
      }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [navigate, refresh]);
  const run = async (fn, message) => { try { setError(""); await fn(); setNotice(message); await refresh(); } catch (e) { setError(e.message); } };
  const signOut = async () => { await supabase?.auth.signOut(); navigate("/admin/login", { replace: true }); };
  if (loading) return <main className="cert-admin-loading">Loading certificate workspace…</main>;
  if (!token) return <Navigate to="/admin/login" replace />;
  return <main className="cert-admin"><aside className="cert-sidebar"><div className="cert-brand"><span>GDG</span><small>Quantum University</small></div><p className="cert-kicker">CERTIFICATE MANAGEMENT</p>{NAV.filter((item) => item !== "Administrators" || role === "super_admin").map((item) => <button key={item} className={section === item ? "active" : ""} onClick={() => setSection(item)}>{item}</button>)}<div className="cert-sidebar-bottom"><span>{typeof role === "string" ? role.replaceAll("_", " ") : "Role unavailable"}</span><button onClick={signOut}>Sign out</button><a href="/">← Back to website</a></div></aside><section className="cert-workspace"><header><div><span className="cert-kicker">GDG QU ADMINISTRATION</span><h1>{section}</h1></div><button className="cert-secondary" onClick={() => refresh()}>Refresh</button></header>{error && <div className="cert-alert cert-error">{error}</div>}{notice && <div className="cert-alert">{notice}<button onClick={() => setNotice("")}>×</button></div>}
    {section === "Overview" && <Overview data={dashboard} />}
    {section === "Events" && <Events events={events} token={token} role={role} run={run} />}
    {section === "Templates" && <Templates templates={templates} token={token} role={role} run={run} />}
    {section === "Issue" && <Issue events={events} templates={templates} token={token} role={role} run={run} />}
    {section === "Bulk generation" && <Bulk events={events} templates={templates} token={token} role={role} run={run} />}
    {section === "Certificates" && <Certificates token={token} run={run} role={role} events={events} />}
    {section === "Activity" && <Activity data={dashboard?.activity || []} />}
    {section === "Administrators" && role === "super_admin" && <Administrators token={token} run={run} />}
  </section></main>;
}

function Overview({ data }) {
  const stats = data?.stats || {};
  return <><div className="cert-stat-grid">{[["Issued", stats.total], ["Active", stats.active], ["Revoked", stats.revoked], ["Events", stats.events], ["Verifications", stats.verifications]].map(([label, value]) => <article className="cert-stat" key={label}><span>{label}</span><strong>{value ?? "—"}</strong></article>)}</div><div className="cert-panels"><article className="cert-panel"><h2>Recent generation jobs</h2><Rows rows={data?.jobs || []} empty="No generation jobs yet." fields={[["source_filename", "File"], ["status", "Status"], ["succeeded_count", "Generated"], ["created_at", "Created"]]} /></article><article className="cert-panel"><h2>Latest activity</h2><Rows rows={data?.activity || []} empty="No administrative activity yet." fields={[["action", "Action"], ["actor_email", "Administrator"], ["created_at", "When"]]} /></article></div></>;
}

function Events({ events, token, role, run }) {
  const allowed = roleCan(role, "Events");
  return <><section className="cert-panel"><h2>Create certificate event</h2>{allowed ? <form className="cert-form-grid" onSubmit={(e) => { e.preventDefault(); const form = e.currentTarget; const f = new FormData(form); const categories = f.get("categories").split(",").map((x) => x.trim()).filter(Boolean); run(() => api("events", token, { method: "POST", body: JSON.stringify({ name: f.get("name"), description: f.get("description"), event_date: f.get("event_date") || null, issue_date: f.get("issue_date") || undefined, organization: f.get("organization"), status: "published", categories, default_category: categories[0] || "Participant" }) }), "Event created.").then(() => form.reset()); }}><label>Event name<input name="name" minLength="2" required /></label><label>Event date<input name="event_date" type="date" /></label><label>Issue date<input name="issue_date" type="date" /></label><label>Organization<input name="organization" defaultValue="GDG on Campus, Quantum University" /></label><label className="wide">Categories (comma-separated)<input name="categories" defaultValue="Participant, Winner, Volunteer, Speaker" /></label><label className="wide">Description<textarea name="description" rows="2" /></label><button>Create event</button></form> : <p>Only certificate or event managers can create events.</p>}</section><section className="cert-panel"><h2>Certificate events</h2><Rows rows={events} empty="No events yet." fields={[["name", "Event"], ["event_date", "Event date"], ["issue_date", "Issue date"], ["status", "Status"]]} /></section></>;
}

function Templates({ templates, token, role, run }) {
  const allowed = role === "super_admin" || role === "certificate_manager";
  return <><section className="cert-panel"><h2>New certificate template</h2>{allowed ? <form className="cert-form-grid" onSubmit={(e) => { e.preventDefault(); const form = e.currentTarget; const f = new FormData(form); run(async () => { const created = await api("templates", token, { method: "POST", body: JSON.stringify({ name: f.get("name"), description: f.get("description"), design: { fields: { recipient: { x: 50, y: 43, fontSize: 34 }, event: { x: 50, y: 55, fontSize: 22 }, category: { x: 50, y: 65, fontSize: 16 }, issueDate: { x: 50, y: 75, fontSize: 13 }, certificateId: { x: 50, y: 94, fontSize: 9 }, qr: { x: 90, y: 86, size: 72 } } }, signatories: [] }) }); const file = f.get("background"); if (file?.size) await api("templates/upload", token, { method: "POST", body: JSON.stringify({ template_id: created.template.id, mime_type: file.type, base64: await fileToBase64(file) }) }); form.reset(); }, "Template saved."); }}><label>Template name<input name="name" minLength="2" required /></label><label>Description<input name="description" /></label><label className="wide">Background artwork (PNG/JPEG, max 2.2 MB)<input name="background" type="file" accept="image/png,image/jpeg" /></label><p className="cert-muted wide">The background is fitted to an A4 landscape PDF. Certificate fields and QR placement use the built-in layout.</p><button>Create template</button></form> : <p>Only certificate managers can create templates.</p>}</section><section className="cert-panel"><h2>Templates</h2><Rows rows={templates} empty="No templates yet." fields={[["name", "Template"], ["description", "Description"], ["is_active", "Active"], ["created_at", "Created"]]} /></section></>;
}

async function fileToBase64(file) { const bytes = new Uint8Array(await file.arrayBuffer()); let binary = ""; const step = 0x8000; for (let i = 0; i < bytes.length; i += step) binary += String.fromCharCode(...bytes.subarray(i, i + step)); return btoa(binary); }
function downloadCsv(rows, filename) { const text = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" })); a.download = filename; a.click(); URL.revokeObjectURL(a.href); }

function Issue({ events, templates, token, role, run }) {
  const [selectedEvent, setSelectedEvent] = useState("");
  if (!roleCan(role, "Issue")) return <section className="cert-panel">Your role cannot issue certificates.</section>;
  const categories = events.find((event) => event.id === selectedEvent)?.categories || ["Participant"];
  return <section className="cert-panel"><h2>Issue one certificate</h2><form className="cert-form-grid" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); run(async () => { const result = await api("issue", token, { method: "POST", body: JSON.stringify({ name: f.get("name"), email: f.get("email"), event_id: f.get("event_id"), template_id: f.get("template_id"), category: f.get("category"), issue_date: f.get("issue_date") || undefined }) }); window.open(result.verification_url, "_blank", "noopener,noreferrer"); }, "Certificate issued and verification page opened."); }}><label>Recipient name<input name="name" minLength="2" required /></label><label>Recipient email<input name="email" type="email" required /></label><label>Event<select name="event_id" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} required><option value="">Choose event</option>{events.map((e) => <option value={e.id} key={e.id}>{e.name}</option>)}</select></label><label>Template<select name="template_id" required><option value="">Choose template</option>{templates.filter((x) => x.is_active).map((t) => <option value={t.id} key={t.id}>{t.name}</option>)}</select></label><label>Category<select name="category">{categories.map((x) => <option key={x}>{x}</option>)}</select></label><label>Issue date<input name="issue_date" type="date" /></label><button>Generate certificate PDF</button></form></section>;
}

function Bulk({ events, templates, token, role, run }) {
  const [rows, setRows] = useState([]); const [filename, setFilename] = useState(""); const [mapping, setMapping] = useState({ name: "", email: "", category: "" }); const [job, setJob] = useState(null); const [busy, setBusy] = useState(false); const headers = useMemo(() => rows[0] || [], [rows]);
  const [selectedEvent, setSelectedEvent] = useState("");
  if (!roleCan(role, "Bulk generation")) return <section className="cert-panel">Your role cannot start bulk jobs.</section>;
  const upload = async (file) => { setFilename(file.name); setJob(null); if (/\.xls$/i.test(file.name)) throw new Error("Legacy .xls files aren’t supported in this browser. Save the workbook as .xlsx or .csv and upload again."); if (/\.xlsx$/i.test(file.name)) { const zip = await JSZip.loadAsync(file); const sheet = await zip.file("xl/worksheets/sheet1.xml")?.async("string"); const sharedXml = await zip.file("xl/sharedStrings.xml")?.async("string"); if (!sheet) throw new Error("Could not read the first worksheet."); const xml = new DOMParser().parseFromString(sheet, "application/xml"); const sharedDoc = sharedXml ? new DOMParser().parseFromString(sharedXml, "application/xml") : null; const shared = sharedDoc ? [...sharedDoc.getElementsByTagName("si")].map((si) => [...si.getElementsByTagName("t")].map((t) => t.textContent).join("")) : []; const parsed = [...xml.getElementsByTagName("row")].map((row) => { const values = []; [...row.getElementsByTagName("c")].forEach((cell) => { const ref = cell.getAttribute("r") || "A1"; const col = ref.match(/^[A-Z]+/)?.[0] || "A"; const index = [...col].reduce((n, letter) => n * 26 + letter.charCodeAt(0) - 64, 0) - 1; const type = cell.getAttribute("t"); const inline = [...cell.getElementsByTagName("t")].map((t) => t.textContent).join(""); const v = inline || cell.getElementsByTagName("v")[0]?.textContent || ""; values[index] = type === "s" ? shared[Number(v)] || "" : v; }); return values.map((v) => v || ""); }); setRows(parsed); } else { const text = await file.text(); const parsed = parseCsvFile(text.replace(/^\uFEFF/, "")); setRows(parsed); } };
  const sendJob = async () => { if (!rows.length) throw new Error("Upload a CSV or XLSX file first."); for (const key of ["name", "email"]) if (mapping[key] === "") throw new Error(`Map the ${key} column.`); const fallbackCategory = events.find((e) => e.id === selectedEvent)?.default_category || "Participant"; const body = { idempotency_key: crypto.randomUUID(), event_id: selectedEvent, template_id: document.querySelector("[name=bulk_template]").value, filename, category: fallbackCategory, rows: rows.slice(1).map((r) => ({ name: r[Number(mapping.name)] || "", email: r[Number(mapping.email)] || "", category: mapping.category === "" ? fallbackCategory : r[Number(mapping.category)] || fallbackCategory })) }; if (!body.event_id || !body.template_id) throw new Error("Choose an event and template."); const created = await api("jobs", token, { method: "POST", body: JSON.stringify(body) }); const details = await api(`jobs/${created.job_id}`, token); setJob({ id: created.job_id, ...created, ...details.job, items: details.items }); };
  const process = async () => { setBusy(true); try { let result; do { result = await api(`jobs/${job.id}/process`, token, { method: "POST", body: "{}" }); setJob((j) => ({ ...j, ...result.job })); } while (result.job.status === "processing" && result.remaining > 0 && result.processed > 0); const details = await api(`jobs/${job.id}`, token); setJob((j) => ({ ...j, ...details.job, items: details.items })); } catch (e) { setJob((j) => ({ ...j, error: e.message })); } finally { setBusy(false); } };
  const retry = async () => { await api(`jobs/${job.id}/retry`, token, { method: "POST", body: "{}" }); setJob((j) => ({ ...j, status: "queued", failed_count: 0 })); };
  const downloadZip = async (part) => { const { data: sessionData } = await supabase.auth.getSession(); const response = await fetch(`/api/certificates/jobs/${job.id}/zip?part=${part}`, { headers: { Authorization: `Bearer ${sessionData.session.access_token}` } }); if (!response.ok) throw new Error("ZIP download failed."); const blob = await response.blob(); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `certificate-job-${job.id}-part-${part}.zip`; a.click(); URL.revokeObjectURL(a.href); };
  const exportIssues = () => { const report = [["row", "name", "email", "status", "errors"], ...(job.items || []).filter((i) => ["invalid", "duplicate", "failed"].includes(i.status)).map((i) => [i.row_number, i.recipient_name, i.recipient_email, i.status, (i.validation_errors || []).join("; ") || i.error_message])]; downloadCsv(report, "certificate-validation-errors.csv"); };
  const exportIssued = () => { const report = [["certificate_id", "name", "email", "category", "verification_url"], ...(job.items || []).filter((i) => i.status === "succeeded").map((i) => [i.certificate_id, i.recipient_name, i.recipient_email, i.category, `${location.origin}/verify/${i.certificate_id}`])]; downloadCsv(report, "issued-certificates.csv"); };
  const sample = async () => { const zip = new JSZip(); const rows = [["name", "email", "category"], ["Ada Lovelace", "ada@example.com", "Participant"]]; const cell = (value, column, row) => `<c r="${column}${row}" t="inlineStr"><is><t>${value}</t></is></c>`; const sheet = rows.map((r, i) => `<row r="${i + 1}">${r.map((v, j) => cell(v, String.fromCharCode(65 + j), i + 1)).join("")}</row>`).join(""); zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`); zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`); zip.file("xl/workbook.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Participants" sheetId="1" r:id="rId1"/></sheets></workbook>`); zip.file("xl/_rels/workbook.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`); zip.file("xl/worksheets/sheet1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheet}</sheetData></worksheet>`); const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "certificate-upload-sample.xlsx"; a.click(); URL.revokeObjectURL(a.href); };
  return <><section className="cert-panel"><h2>Prepare a batch</h2><div className="cert-form-grid"><label>Event<select name="bulk_event" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}><option value="">Choose event</option>{events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></label><label>Template<select name="bulk_template"><option value="">Choose template</option>{templates.filter((t) => t.is_active).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label><label className="wide">Participants file (.xlsx or .csv)<input type="file" accept=".xlsx,.csv" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0]).catch((x) => setJob({ error: x.message }))} /></label><button className="cert-secondary" type="button" onClick={() => sample().catch((e) => setJob({ error: e.message }))}>Download sample Excel</button></div>{job?.error && <p className="cert-error">{job.error}</p>}{headers.length > 0 && <><p>{rows.length - 1} rows loaded from {filename}. Map the header row:</p><div className="cert-form-grid">{["name", "email", "category"].map((key) => <label key={key}>{key}<select value={mapping[key]} onChange={(e) => setMapping({ ...mapping, [key]: e.target.value })}><option value="">{key === "category" ? "Use Participant" : "Choose column"}</option>{headers.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}</select></label>)}</div><button disabled={busy} onClick={() => run(sendJob, "Bulk job queued.")}>Validate and create job</button></>}</section>{job?.id && <section className="cert-panel"><h2>Generation job</h2><p>{job.id} · {job.total_count ?? job.total} uploaded · {job.valid_count ?? job.valid} valid · {job.invalid_count ?? job.invalid} invalid · {job.duplicate_count ?? job.duplicates} duplicates</p><p>Status: {job.status || "queued"} · Generated: {job.succeeded_count || 0} · Failed: {job.failed_count || 0}</p><div className="cert-toolbar"><button disabled={busy || ["completed", "partial"].includes(job.status)} onClick={process}>{busy ? "Processing batch…" : "Process / resume next batches"}</button>{job.status === "partial" && <button className="cert-secondary" onClick={() => retry().catch((e) => setJob((j) => ({ ...j, error: e.message }))) }>Retry failed</button>}<button className="cert-secondary" onClick={exportIssues}>Download validation report</button><button className="cert-secondary" onClick={exportIssued}>Export issued IDs / links</button>{Array.from({ length: Math.ceil((job.succeeded_count || 0) / 25) }, (_, i) => <button className="cert-secondary" key={i} onClick={() => downloadZip(i + 1).catch((e) => setJob((j) => ({ ...j, error: e.message }))) }>Download ZIP part {i + 1}</button>)}</div>{job?.error && <p className="cert-error">{job.error}</p>}<Rows rows={(job.items || []).slice(0, 100)} empty="No participants loaded." fields={[["row_number", "Row"], ["recipient_name", "Name"], ["recipient_email", "Email"], ["status", "Status"], ["error_message", "Details"]]} /></section>}</>;
}

function Certificates({ token, role, events }) {
  const [data, setData] = useState({ certificates: [], total: 0, page: 1 }); const [search, setSearch] = useState(""); const [status, setStatus] = useState(""); const [event, setEvent] = useState(""); const [error, setError] = useState("");
  const load = useCallback(async (page = 1) => { try { const q = new URLSearchParams({ page, page_size: 25 }); if (search) q.set("search", search); if (status) q.set("status", status); if (event) q.set("event_id", event); setData(await api(`certificates?${q}`, token)); } catch (e) { setError(e.message); } }, [token, search, status, event]);
  useEffect(() => { load(1); }, [load]);
  const download = async (id) => { const { url } = await api(`certificates/${id}/download`, token, { method: "POST", body: "{}" }); window.open(url, "_blank", "noopener,noreferrer"); };
  const revoke = async (id) => { const reason = window.prompt("Reason for revoking this certificate:"); if (!reason) return; try { await api(`certificates/${id}/revoke`, token, { method: "POST", body: JSON.stringify({ reason }) }); await load(data.page); } catch (e) { setError(e.message); } };
  const csv = () => { const lines = [["certificate_id", "name", "email", "category", "status", "verification_url"], ...data.certificates.map((c) => [c.certificate_id, c.recipient_name, c.recipient_email, c.category, c.status, `${location.origin}/verify/${c.certificate_id}`])]; const text = lines.map((r) => r.map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" })); a.download = "certificates.csv"; a.click(); URL.revokeObjectURL(a.href); };
  return <section className="cert-panel"><h2>Issued certificates ({data.total})</h2>{error && <p className="cert-error">{error}</p>}<div className="cert-toolbar"><input placeholder="Search name or certificate ID" value={search} onChange={(e) => setSearch(e.target.value)} /><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="revoked">Revoked</option></select><select value={event} onChange={(e) => setEvent(e.target.value)}><option value="">All events</option>{events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select><button className="cert-secondary" onClick={csv}>Export current page</button></div><table className="cert-table"><thead><tr>{["Certificate ID", "Recipient", "Email", "Event", "Category", "Status", "Actions"].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{data.certificates.map((c) => <tr key={c.id}><td>{c.certificate_id}</td><td>{c.recipient_name}</td><td>{c.recipient_email}</td><td>{c.certificate_events?.name}</td><td>{c.category}</td><td>{c.status}</td><td><button className="cert-link" onClick={() => download(c.id)}>PDF</button>{c.status === "active" && (role === "super_admin" || role === "certificate_manager") && <button className="cert-link danger" onClick={() => revoke(c.id)}>Revoke</button>}</td></tr>)}</tbody></table>{!data.certificates.length && <p className="cert-muted">No certificates match these filters.</p>}<div className="cert-pagination"><button disabled={data.page <= 1} onClick={() => load(data.page - 1)}>Previous</button><span>Page {data.page} / {Math.max(1, Math.ceil(data.total / 25))}</span><button disabled={data.page * 25 >= data.total} onClick={() => load(data.page + 1)}>Next</button></div></section>;
}
function Activity({ data }) { return <section className="cert-panel"><h2>Recent actions</h2><Rows rows={data} empty="No activity yet." fields={[["action", "Action"], ["target_type", "Target"], ["target_id", "Record"], ["actor_email", "Administrator"], ["created_at", "Timestamp"]]} /></section>; }
function Administrators({ token, run }) { const [admins, setAdmins] = useState([]); const [error, setError] = useState(""); const load = useCallback(() => api("admins", token).then((r) => setAdmins(r.admins)).catch((e) => setError(e.message)), [token]); useEffect(() => { load(); }, [load]); const update = (email, changes) => run(async () => { await api(`admins/${encodeURIComponent(email)}`, token, { method: "PATCH", body: JSON.stringify(changes) }); await load(); }, "Administrator permissions updated."); return <section className="cert-panel"><h2>Administrator roles</h2><p className="cert-muted">Add authorized emails using the Supabase SQL setup, then assign the least privilege needed here.</p>{error && <p className="cert-error">{error}</p>}<div className="cert-table-wrap"><table className="cert-table"><thead><tr><th>Email</th><th>Role</th><th>Active</th><th>Actions</th></tr></thead><tbody>{admins.map((a) => <tr key={a.email}><td>{a.email}</td><td><select value={a.role} onChange={(e) => update(a.email, { role: e.target.value })}><option value="super_admin">Super admin</option><option value="certificate_manager">Certificate manager</option><option value="event_manager">Event manager</option><option value="viewer">Viewer</option></select></td><td>{a.is_active ? "Yes" : "No"}</td><td><button className="cert-link" onClick={() => update(a.email, { is_active: !a.is_active })}>{a.is_active ? "Deactivate" : "Activate"}</button></td></tr>)}</tbody></table></div></section>; }
function Rows({ rows, fields, empty }) { return !rows.length ? <p className="cert-muted">{empty}</p> : <div className="cert-table-wrap"><table className="cert-table"><thead><tr>{fields.map(([, title]) => <th key={title}>{title}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={row.id || i}>{fields.map(([key]) => <td key={key}>{key.endsWith("_at") && row[key] ? new Date(row[key]).toLocaleString() : String(row[key] ?? "—")}</td>)}</tr>)}</tbody></table></div>; }
