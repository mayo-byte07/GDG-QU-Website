import test from "node:test";
import assert from "node:assert/strict";
import { classifyParticipants, isCertificateId, newCertificateId } from "../api/_lib/certificate-utils.js";
import { parseCsv, mapRows } from "../Frontend/src/lib/certificate-import.js";
import { renderAndStoreCertificate } from "../api/_lib/render-certificate.js";
import { requireRoles } from "../api/_lib/certificates.js";

test("certificate IDs are unique and match the required public format", () => {
  const ids = new Set(Array.from({ length: 5000 }, () => newCertificateId(2026)));
  assert.equal(ids.size, 5000);
  for (const id of ids) assert.equal(isCertificateId(id), true);
  assert.equal(isCertificateId("GDGQU-2026-123"), false);
});

test("bulk classifier handles 500 participants, missing fields, and duplicates", () => {
  const source = Array.from({ length: 500 }, (_, i) => ({ name: `Participant ${i}`, email: `p${i}@example.edu` }));
  source[10] = { name: "", email: "bad-email" };
  source[11] = { name: "Participant 1", email: "p1@example.edu" };
  const result = classifyParticipants(source);
  assert.equal(result.participants.length, 500);
  assert.equal(result.valid, 498);
  assert.equal(result.invalid, 1);
  assert.equal(result.duplicate, 1);
  assert.deepEqual(result.participants[10].errors, ["Name is required", "Valid email is required"]);
  assert.equal(result.participants[11].status, "duplicate");
});

test("CSV parser handles commas, escaped quotes, and column mapping", () => {
  const parsed = parseCsv('name,email,category\r\n"Ada, Lovelace",ada@example.org,"Core Team"\r\n"Sam ""S""",sam@example.org,Speaker');
  assert.deepEqual(parsed[1], ["Ada, Lovelace", "ada@example.org", "Core Team"]);
  assert.deepEqual(parsed[2], ['Sam "S"', "sam@example.org", "Speaker"]);
  assert.deepEqual(mapRows(parsed[0], parsed.slice(1), { name: 0, email: 1, category: 2 })[0], { name: "Ada, Lovelace", email: "ada@example.org", category: "Core Team" });
});

test("server role gate denies viewer and allows certificate manager", async () => {
  const denied = requireRoles({ role: "viewer" }, ["certificate_manager"]);
  assert.equal(denied.status, 403);
  assert.equal(requireRoles({ role: "certificate_manager" }, ["certificate_manager"]), null);
});

test("certificate renderer uploads a PDF and PNG QR code", async () => {
  const uploads = new Map();
  const db = { storage: { from: () => ({ upload: async (path, file, options) => { uploads.set(path, { file: Buffer.from(file), options }); return { data: {}, error: null }; } }) } };
  const certificate = { id: "test-uuid", certificate_id: "GDGQU-2026-A8F72D91C34B20E5", recipient_name: "Test Recipient", category: "Participant", issue_date: "2026-11-17" };
  const event = { id: "event-uuid", name: "Testing Event" };
  const template = { page_width_mm: 297, page_height_mm: 210, design: {}, signatories: [] };
  const result = await renderAndStoreCertificate(db, certificate, event, template);
  const pdf = uploads.get(result.pdf_storage_path);
  const qr = uploads.get(result.qr_storage_path);
  assert.equal(pdf.file.subarray(0, 5).toString(), "%PDF-");
  assert.deepEqual([...qr.file.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(pdf.options.contentType, "application/pdf");
  assert.equal(qr.options.contentType, "image/png");
});
