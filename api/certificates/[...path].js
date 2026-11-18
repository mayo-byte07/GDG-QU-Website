import { createSupabaseContext } from "@supabase/server";
import JSZip from "jszip";
import {
  cleanText, getAdminContext, isEmail, json, readJson,
  requireEventAccess, requireRoles, toWebRequest, writeAudit,
} from "../_lib/certificates.js";
import { renderAndStoreCertificate, verificationUrl } from "../_lib/render-certificate.js";
import { CATEGORIES, classifyParticipants, newCertificateId } from "../_lib/certificate-utils.js";

const dbOf = (ctx) => ctx.supabaseAdmin;
const errorResponse = (e) => json({ error: e?.message || "Request failed." }, e?.status || (e instanceof SyntaxError ? 400 : 500));
const verifyHits = new Map();
const isDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

async function dashboard(db) {
  const [all, active, revoked, events, verifications, jobs, audit] = await Promise.all([
    db.from("certificates").select("id", { count: "exact", head: true }),
    db.from("certificates").select("id", { count: "exact", head: true }).eq("status", "active").eq("generation_status", "ready"),
    db.from("certificates").select("id", { count: "exact", head: true }).eq("status", "revoked"),
    db.from("certificate_events").select("id", { count: "exact", head: true }),
    db.from("certificate_verification_logs").select("id", { count: "exact", head: true }),
    db.from("certificate_generation_jobs").select("id,status,total_count,succeeded_count,failed_count,created_at,source_filename").order("created_at", { ascending: false }).limit(8),
    db.from("certificate_audit_logs").select("id,action,target_type,target_id,actor_email,created_at").order("created_at", { ascending: false }).limit(8),
  ]);
  const err = [all, active, revoked, events, verifications, jobs, audit].find((r) => r.error);
  if (err) throw err.error;
  return json({ stats: { total: all.count, active: active.count, revoked: revoked.count, events: events.count, verifications: verifications.count }, jobs: jobs.data, activity: audit.data });
}

async function issueOne(ctx, admin, email, payload, idempotencyKey = null) {
  const db = dbOf(ctx);
  const name = cleanText(payload.name || payload.recipient_name, 160);
  const recipientEmail = cleanText(payload.email || payload.recipient_email, 254).toLowerCase();
  const eventId = cleanText(payload.event_id, 64);
  const templateId = cleanText(payload.template_id, 64);
  const category = cleanText(payload.category || "Participant", 80);
  if (name.length < 2 || !isEmail(recipientEmail) || !eventId || !templateId || !CATEGORIES.includes(category)) {
    throw Object.assign(new Error("Name, valid email, event, template, and supported category are required."), { status: 400 });
  }
  const accessError = await requireEventAccess(ctx, admin, email, eventId);
  if (accessError) throw Object.assign(new Error("You do not have access to this event."), { status: accessError.status });

  const [{ data: event, error: ee }, { data: template, error: te }] = await Promise.all([
    db.from("certificate_events").select("*").eq("id", eventId).maybeSingle(),
    db.from("certificate_templates").select("*").eq("id", templateId).eq("is_active", true).maybeSingle(),
  ]);
  if (ee || te) throw ee || te;
  if (!event || event.status === "closed") throw Object.assign(new Error("Certificate event is unavailable."), { status: 400 });
  if (Array.isArray(event.categories) && event.categories.length && !event.categories.includes(category)) throw Object.assign(new Error("This category is not enabled for the selected event."), { status: 400 });
  if (!template) throw Object.assign(new Error("Active certificate template not found."), { status: 400 });

  const issueDate = payload.issue_date || event.issue_date;
  if (!isDate(issueDate)) throw Object.assign(new Error("Issue date must be a valid YYYY-MM-DD date."), { status: 400 });
  const record = {
    certificate_id: newCertificateId(), idempotency_key: idempotencyKey,
    recipient_name: name, recipient_email: recipientEmail, event_id: eventId,
    template_id: templateId, category, issue_date: issueDate,
    created_by: ctx.userClaims?.sub, status: "active", generation_status: "pending",
  };
  let cert;
  const { data: created, error: ce } = await db.from("certificates").insert(record).select("*").single();
  if (!ce) cert = created;
  else if (ce.code === "23505") {
    let lookup = db.from("certificates").select("*");
    if (idempotencyKey) lookup = lookup.eq("idempotency_key", idempotencyKey);
    else lookup = lookup.eq("event_id", eventId).ilike("recipient_email", recipientEmail).ilike("category", category);
    const { data: existing, error: lookupError } = await lookup.maybeSingle();
    if (lookupError) throw lookupError;
    if (!existing || existing.event_id !== eventId || existing.recipient_email.toLowerCase() !== recipientEmail || existing.category.toLowerCase() !== category.toLowerCase()) {
      throw Object.assign(new Error("A certificate already exists for this recipient, event, and category."), { status: 409 });
    }
    if (existing.status !== "active" || existing.generation_status === "ready" || (idempotencyKey && existing.idempotency_key !== idempotencyKey)) {
      throw Object.assign(new Error("A certificate already exists for this recipient, event, and category."), { status: 409 });
    }
    const { data: retryCert, error: retryError } = await db.from("certificates").update({ template_id: templateId, issue_date: record.issue_date, generation_status: "pending", updated_at: new Date().toISOString() }).eq("id", existing.id).select("*").single();
    if (retryError) throw retryError;
    cert = retryCert;
  } else throw ce;
  try {
    const files = await renderAndStoreCertificate(db, cert, event, template);
    const { data: updated, error: ue } = await db.from("certificates").update({ ...files, generation_status: "ready" }).eq("id", cert.id).select("id,certificate_id,recipient_name,category,issue_date,status,generation_status").single();
    if (ue) throw ue;
    await writeAudit(db, { actorId: ctx.userClaims?.sub, actorEmail: email, action: "certificate.issued", targetType: "certificate", targetId: cert.id });
    return updated;
  } catch (e) {
    await db.from("certificates").update({ generation_status: "failed" }).eq("id", cert.id);
    throw e;
  }
}

export default async function handler(req, res) {
  const routeParam = req.query?.path;
  const pathname = new URL(req.url || "/", "http://localhost").pathname;
  const routeFromUrl = pathname.startsWith("/api/certificates/")
    ? pathname.slice("/api/certificates/".length).split("/").filter(Boolean)
    : [];
  const routeParts = Array.isArray(routeParam)
    ? routeParam
    : typeof routeParam === "string" && routeParam
      ? routeParam.split("/").filter(Boolean)
      : routeFromUrl;
  const parts = routeParts.map((p) => decodeURIComponent(p));
  const method = req.method || "GET";
  try {
    if (parts[0] === "verify" && parts[1] && method === "GET") return send(res, await verify(req, parts[1]));
    const contextResult = await getAdminContext(req);
    if (contextResult.response) return send(res, contextResult.response);
    const { context: ctx, admin, email } = contextResult;
    const db = dbOf(ctx);
    if (parts[0] === "access" && method === "GET") return send(res, json({ email, role: admin.role }));
    if (parts[0] === "dashboard" && method === "GET") return send(res, await dashboard(db));
    if (parts[0] === "admins") {
      if (admin.role !== "super_admin") return send(res, json({ error: "Only a super administrator can manage administrator roles." }, 403));
      if (method === "GET" && !parts[1]) {
        const { data, error } = await db.from("admin_users").select("email,role,is_active,created_at").order("email");
        if (error) throw error; return send(res, json({ admins: data }));
      }
      if (method === "PATCH" && parts[1]) {
        const targetEmail = cleanText(parts[1], 254).toLowerCase(); const b = await body(req);
        const validRoles = ["super_admin", "certificate_manager", "event_manager", "viewer"];
        if (b.role == null && typeof b.is_active !== "boolean") return send(res, json({ error: "Supply a role or active-state change." }, 400));
        if (b.role != null && !validRoles.includes(b.role)) return send(res, json({ error: "Unknown administrator role." }, 400));
        if (targetEmail === email && (b.is_active === false || (b.role && b.role !== "super_admin"))) return send(res, json({ error: "You cannot remove your own super administrator access." }, 400));
        const update = {};
        if (b.role) update.role = b.role;
        if (typeof b.is_active === "boolean") update.is_active = b.is_active;
        const { data, error } = await db.from("admin_users").update(update).eq("email", targetEmail).select("email,role,is_active,created_at").maybeSingle();
        if (error) throw error; if (!data) return send(res, json({ error: "Administrator not found." }, 404));
        await writeAudit(db, { actorId: ctx.userClaims?.sub, actorEmail: email, action: "admin.permission_changed", targetType: "admin", targetId: targetEmail, metadata: { role: data.role, is_active: data.is_active } });
        return send(res, json({ admin: data }));
      }
    }
    if (parts[0] === "events") {
      if (method === "GET") {
        let query = db.from("certificate_events").select("*").order("created_at", { ascending: false });
        if (admin.role === "event_manager") {
          const { data: links, error: linkError } = await db.from("certificate_event_access").select("event_id").eq("admin_email", email);
          if (linkError) throw linkError;
          const ids = (links || []).map((x) => x.event_id); if (!ids.length) return send(res, json({ events: [] }));
          query = query.in("id", ids);
        }
        const { data, error } = await query;
        if (error) throw error; return send(res, json({ events: data }));
      }
      if (method === "POST") {
        const denied = requireRoles(admin, ["certificate_manager", "event_manager"]); if (denied) return send(res, denied);
        const b = await body(req); const name = cleanText(b.name, 180);
        if (name.length < 2) return send(res, json({ error: "Event name is required." }, 400));
        const categories = [...new Set((Array.isArray(b.categories) ? b.categories : ["Participant"]).filter((v) => CATEGORIES.includes(v)))];
        if (!categories.length) categories.push("Participant");
        const defaultCategory = categories.includes(b.default_category) ? b.default_category : categories[0];
        const eventDate = b.event_date || null;
        const issueDate = b.issue_date || new Date().toISOString().slice(0, 10);
        if ((eventDate && !isDate(eventDate)) || !isDate(issueDate)) return send(res, json({ error: "Event and issue dates must use a valid YYYY-MM-DD date." }, 400));
        const { data, error } = await db.from("certificate_events").insert({ name, description: cleanText(b.description, 5000), event_date: eventDate, organization: cleanText(b.organization, 180) || "GDG on Campus, Quantum University", issue_date: issueDate, default_category: defaultCategory, categories, status: ["draft", "published", "closed"].includes(b.status) ? b.status : "draft", created_by: ctx.userClaims?.sub }).select("*").single();
        if (error) throw error;
        if (admin.role === "event_manager") {
          const { error: accessError } = await db.from("certificate_event_access").insert({ event_id: data.id, admin_email: email });
          if (accessError) throw accessError;
        }
        await writeAudit(db, { actorId: ctx.userClaims?.sub, actorEmail: email, action: "event.created", targetType: "event", targetId: data.id });
        return send(res, json({ event: data }, 201));
      }
    }
    if (parts[0] === "events" && parts[1] && parts[2] === "access" && method === "POST") {
      const denied = requireRoles(admin, ["certificate_manager"]); if (denied) return send(res, denied);
      const b = await body(req); const targetEmail = cleanText(b.email, 254).toLowerCase();
      if (!isEmail(targetEmail)) return send(res, json({ error: "Enter a valid administrator email." }, 400));
      const { data: target, error: targetError } = await db.from("admin_users").select("email").eq("email", targetEmail).eq("is_active", true).maybeSingle();
      if (targetError) throw targetError; if (!target) return send(res, json({ error: "This email is not an active administrator." }, 404));
      const { error } = await db.from("certificate_event_access").upsert({ event_id: parts[1], admin_email: targetEmail }, { onConflict: "event_id,admin_email" });
      if (error) throw error; await writeAudit(db, { actorId: ctx.userClaims?.sub, actorEmail: email, action: "event.access_granted", targetType: "event", targetId: parts[1], metadata: { admin_email: targetEmail } });
      return send(res, json({ ok: true }));
    }
    if (parts[0] === "templates") {
      if (method === "GET") {
        const { data, error } = await db.from("certificate_templates").select("*").order("created_at", { ascending: false });
        if (error) throw error; return send(res, json({ templates: data }));
      }
      if (method === "POST") {
        const denied = requireRoles(admin, ["certificate_manager"]); if (denied) return send(res, denied);
        const b = await body(req); const name = cleanText(b.name, 120);
        if (name.length < 2) return send(res, json({ error: "Template name is required." }, 400));
        const { data, error } = await db.from("certificate_templates").insert({ name, description: cleanText(b.description, 3000), design: b.design || {}, signatories: Array.isArray(b.signatories) ? b.signatories.slice(0, 4) : [], page_width_mm: Number(b.page_width_mm) || 297, page_height_mm: Number(b.page_height_mm) || 210, created_by: ctx.userClaims?.sub }).select("*").single();
        if (error) throw error; await writeAudit(db, { actorId: ctx.userClaims?.sub, actorEmail: email, action: "template.created", targetType: "template", targetId: data.id });
        return send(res, json({ template: data }, 201));
      }
      if (parts[1] === "upload" && method === "POST") {
        const denied = requireRoles(admin, ["certificate_manager"]); if (denied) return send(res, denied);
        const b = await body(req); const templateId = cleanText(b.template_id, 64);
        const mime = cleanText(b.mime_type, 40).toLowerCase();
        if (!/^[0-9a-f-]{36}$/i.test(templateId) || !["image/png", "image/jpeg"].includes(mime)) return send(res, json({ error: "A template ID and PNG/JPEG image are required." }, 400));
        const base64 = String(b.base64 || ""); if (base64.length > 3_000_000) return send(res, json({ error: "Image exceeds the 2.2 MB upload limit." }, 413));
        const bytes = Buffer.from(base64, "base64");
        const validMagic = mime === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) : bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]));
        if (!bytes.length || !validMagic) return send(res, json({ error: "The selected image does not match its PNG/JPEG type." }, 400));
        const { data: template, error: templateError } = await db.from("certificate_templates").select("id").eq("id", templateId).maybeSingle();
        if (templateError) throw templateError; if (!template) return send(res, json({ error: "Template not found." }, 404));
        const ext = mime === "image/png" ? "png" : "jpg"; const path = `templates/${templateId}/background.${ext}`;
        const { error: uploadError } = await db.storage.from("certificate-files").upload(path, bytes, { contentType: mime, upsert: true });
        if (uploadError) throw uploadError;
        const { data, error } = await db.from("certificate_templates").update({ background_path: path, background_mime_type: mime, updated_at: new Date().toISOString() }).eq("id", templateId).select("id,name,background_path,background_mime_type").single();
        if (error) throw error; await writeAudit(db, { actorId: ctx.userClaims?.sub, actorEmail: email, action: "template.background_uploaded", targetType: "template", targetId: templateId });
        return send(res, json({ template: data }));
      }
    }
    if (parts[0] === "issue" && method === "POST") {
      const denied = requireRoles(admin, ["certificate_manager", "event_manager"]); if (denied) return send(res, denied);
      const b = await body(req); const certificate = await issueOne(ctx, admin, email, b);
      return send(res, json({ certificate, verification_url: verificationUrl(certificate.certificate_id) }, 201));
    }
    if (parts[0] === "certificates" && method === "GET") {
      const page = Math.max(1, Number(req.query?.page) || 1); const pageSize = Math.min(100, Math.max(1, Number(req.query?.page_size) || 25));
      let query = db.from("certificates").select("id,certificate_id,recipient_name,recipient_qid,recipient_email,event_id,template_id,category,issue_date,status,generation_status,created_at,revoked_at,revocation_reason,certificate_events(name)", { count: "exact" });
      if (admin.role === "event_manager") {
        const { data: links, error: linkError } = await db.from("certificate_event_access").select("event_id").eq("admin_email", email);
        if (linkError) throw linkError; const ids = (links || []).map((item) => item.event_id);
        if (!ids.length) return send(res, json({ certificates: [], total: 0, page, page_size: pageSize }));
        query = query.in("event_id", ids);
      }
      if (req.query?.event_id) query = query.eq("event_id", req.query.event_id);
      if (req.query?.status) query = query.eq("status", req.query.status);
      if (req.query?.search) query = query.or(`certificate_id.ilike.%${String(req.query.search).replace(/[(),]/g, " ")}%,recipient_name.ilike.%${String(req.query.search).replace(/[(),]/g, " ")}%,recipient_email.ilike.%${String(req.query.search).replace(/[(),]/g, " %")}%`);
      const { data, error, count } = await query.order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);
      if (error) throw error; return send(res, json({ certificates: data, total: count, page, page_size: pageSize }));
    }
    if (parts[0] === "certificates" && parts[1] && parts[2] === "revoke" && method === "POST") {
      const denied = requireRoles(admin, ["certificate_manager"]); if (denied) return send(res, denied);
      const b = await body(req); const reason = cleanText(b.reason, 500);
      if (reason.length < 5) return send(res, json({ error: "Please provide a revocation reason (at least 5 characters)." }, 400));
      const { data, error } = await db.from("certificates").update({ status: "revoked", revoked_at: new Date().toISOString(), revoked_by: ctx.userClaims?.sub, revocation_reason: reason }).eq("id", parts[1]).eq("status", "active").select("id,certificate_id,status,revoked_at").maybeSingle();
      if (error) throw error; if (!data) return send(res, json({ error: "Active certificate not found." }, 404));
      await writeAudit(db, { actorId: ctx.userClaims?.sub, actorEmail: email, action: "certificate.revoked", targetType: "certificate", targetId: data.id, metadata: { reason } });
      return send(res, json({ certificate: data }));
    }
    if (parts[0] === "certificates" && parts[1] && parts[2] === "download" && method === "POST") {
      const { data, error } = await db.from("certificates").select("id,event_id,pdf_storage_path,status,generation_status").eq("id", parts[1]).maybeSingle();
      if (error) throw error; if (!data || !data.pdf_storage_path || data.generation_status !== "ready") return send(res, json({ error: "Certificate file not found." }, 404));
      const accessError = await requireEventAccess(ctx, admin, email, data.event_id); if (accessError) return send(res, accessError);
      const { data: signed, error: signedError } = await db.storage.from("certificate-files").createSignedUrl(data.pdf_storage_path, 60);
      if (signedError) throw signedError;
      await writeAudit(db, { actorId: ctx.userClaims?.sub, actorEmail: email, action: "certificate.downloaded_by_admin", targetType: "certificate", targetId: data.id });
      return send(res, json({ url: signed.signedUrl }));
    }
    if (parts[0] === "jobs" && method === "GET") {
      let query = db.from("certificate_generation_jobs").select("*").order("created_at", { ascending: false }).limit(50);
      if (admin.role === "event_manager") {
        const { data: links, error: linkError } = await db.from("certificate_event_access").select("event_id").eq("admin_email", email);
        if (linkError) throw linkError; const ids = (links || []).map((item) => item.event_id);
        if (!ids.length) return send(res, json({ jobs: [] })); query = query.in("event_id", ids);
      }
      const { data, error } = await query;
      if (error) throw error; return send(res, json({ jobs: data }));
    }
    if (parts[0] === "jobs" && method === "POST") {
      const denied = requireRoles(admin, ["certificate_manager", "event_manager"]); if (denied) return send(res, denied);
      const b = await body(req); const rows = Array.isArray(b.rows) ? b.rows.slice(0, 5000) : [];
      if (!rows.length) return send(res, json({ error: "Upload at least one row." }, 400));
      const accessError = await requireEventAccess(ctx, admin, email, b.event_id); if (accessError) return send(res, accessError);
      const [{ data: event, error: eventError }, { data: template, error: templateError }] = await Promise.all([
        db.from("certificate_events").select("id,categories,status").eq("id", b.event_id).maybeSingle(),
        db.from("certificate_templates").select("id").eq("id", b.template_id).eq("is_active", true).maybeSingle(),
      ]);
      if (eventError || templateError) throw eventError || templateError;
      if (!event || event.status === "closed") return send(res, json({ error: "Certificate event is unavailable." }, 400));
      if (!template) return send(res, json({ error: "Active certificate template not found." }, 400));
      const idem = b.idempotency_key || crypto.randomUUID(); const jobId = crypto.randomUUID();
      const classified = classifyParticipants(rows, b.category || "Participant");
      const allowedCategories = Array.isArray(event.categories) && event.categories.length ? event.categories : ["Participant"];
      classified.participants.forEach((row) => {
        if (row.status === "pending" && !allowedCategories.includes(row.category)) { row.status = "invalid"; row.errors.push("Category is not enabled for this event"); }
      });
      const valid = classified.participants.filter((row) => row.status === "pending").length;
      const invalid = classified.participants.filter((row) => row.status === "invalid").length;
      const duplicate = classified.participants.filter((row) => row.status === "duplicate").length;
      const items = classified.participants.map((row, i) => ({ job_id: jobId, row_number: row.row_number, recipient_name: row.name || null, recipient_email: row.email || null, category: row.category, raw_record: rows[i], validation_errors: row.errors, status: row.status }));
      const { error: je } = await db.from("certificate_generation_jobs").insert({ id: jobId, idempotency_key: idem, event_id: b.event_id, template_id: b.template_id, source_filename: cleanText(b.filename, 255), total_count: rows.length, valid_count: valid, invalid_count: invalid, duplicate_count: duplicate, created_by: ctx.userClaims?.sub });
      if (je) {
        if (je.code === "23505") {
          const { data: existing } = await db.from("certificate_generation_jobs").select("id,total_count,valid_count,invalid_count,duplicate_count,status,succeeded_count,failed_count").eq("idempotency_key", idem).maybeSingle();
          if (existing) return send(res, json({ job_id: existing.id, total: existing.total_count, valid: existing.valid_count, invalid: existing.invalid_count, duplicates: existing.duplicate_count, status: existing.status, succeeded_count: existing.succeeded_count, failed_count: existing.failed_count }));
          return send(res, json({ error: "This generation job already exists." }, 409));
        }
        throw je;
      }
      for (let at = 0; at < items.length; at += 250) { const { error } = await db.from("certificate_generation_job_items").insert(items.slice(at, at + 250)); if (error) throw error; }
      await writeAudit(db, { actorId: ctx.userClaims?.sub, actorEmail: email, action: "bulk.started", targetType: "job", targetId: jobId, metadata: { total: rows.length } });
      return send(res, json({ job_id: jobId, total: rows.length, valid, invalid, duplicates: duplicate }, 201));
    }
    if (parts[0] === "jobs" && parts[1] && parts[2] === "process" && method === "POST") {
      const denied = requireRoles(admin, ["certificate_manager", "event_manager"]); if (denied) return send(res, denied);
      return send(res, await processJob(ctx, admin, email, parts[1]));
    }
    if (parts[0] === "jobs" && parts[1] && parts[2] === "retry" && method === "POST") {
      const denied = requireRoles(admin, ["certificate_manager"]); if (denied) return send(res, denied);
      const { error: retryError } = await db.from("certificate_generation_job_items").update({ status: "pending", attempts: 0, error_message: null, updated_at: new Date().toISOString() }).eq("job_id", parts[1]).eq("status", "failed");
      if (retryError) throw retryError;
      const { error: resetError } = await db.from("certificate_generation_jobs").update({ status: "queued", failed_count: 0, completed_at: null, updated_at: new Date().toISOString() }).eq("id", parts[1]);
      if (resetError) throw resetError;
      return send(res, json({ ok: true }));
    }
    if (parts[0] === "jobs" && parts[1] && parts[2] === "zip" && method === "GET") return send(res, await downloadJobZip(ctx, admin, email, parts[1], Number(req.query?.part) || 1));
    if (parts[0] === "jobs" && parts[1] && method === "GET") {
      const [{ data: job, error }, { data: items, error: ie }] = await Promise.all([db.from("certificate_generation_jobs").select("*").eq("id", parts[1]).maybeSingle(), db.from("certificate_generation_job_items").select("id,row_number,recipient_name,recipient_email,category,status,validation_errors,error_message,certificate_id,attempts").eq("job_id", parts[1]).order("row_number").limit(5000)]);
      if (error || ie) throw error || ie; if (!job) return send(res, json({ error: "Job not found." }, 404));
      const accessError = await requireEventAccess(ctx, admin, email, job.event_id); if (accessError) return send(res, accessError);
      return send(res, json({ job, items }));
    }
    return send(res, json({ error: "Certificate route not found." }, 404));
  } catch (e) { console.error("Certificate API error:", e); return send(res, errorResponse(e)); }
}

async function processJob(ctx, admin, email, jobId) {
  const db = dbOf(ctx);
  const { data: job, error: je } = await db.from("certificate_generation_jobs").select("*").eq("id", jobId).maybeSingle();
  if (je) throw je; if (!job) return json({ error: "Job not found." }, 404);
  const accessError = await requireEventAccess(ctx, admin, email, job.event_id); if (accessError) return accessError;
  const { data: event } = await db.from("certificate_events").select("*").eq("id", job.event_id).single();
  const { data: template } = await db.from("certificate_templates").select("*").eq("id", job.template_id).single();
  const staleAt = new Date(Date.now() - 60_000).toISOString();
  const { error: recoverError } = await db.from("certificate_generation_job_items").update({ status: "pending", updated_at: new Date().toISOString(), error_message: "Recovered after an interrupted batch." }).eq("job_id", jobId).eq("status", "processing").lt("updated_at", staleAt);
  if (recoverError) throw recoverError;
  const { error: up } = await db.from("certificate_generation_jobs").update({ status: "processing", started_at: job.started_at || new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", jobId);
  if (up) throw up;
  // Each HTTP invocation processes a bounded batch and can be safely resumed.
  const { data: pending, error } = await db.from("certificate_generation_job_items").select("*").eq("job_id", jobId).in("status", ["pending", "failed"]).lt("attempts", 4).order("row_number").limit(5);
  if (error) throw error;
  for (const item of pending) {
    await db.from("certificate_generation_job_items").update({ status: "processing", attempts: item.attempts + 1, updated_at: new Date().toISOString() }).eq("id", item.id);
    try {
      const cert = await issueOne(ctx, admin, email, { name: item.recipient_name, email: item.recipient_email, category: item.category || "Participant", event_id: job.event_id, template_id: job.template_id }, `${jobId}:${item.row_number}`);
      await db.from("certificate_generation_job_items").update({ status: "succeeded", certificate_id: cert.id, error_message: null, updated_at: new Date().toISOString() }).eq("id", item.id);
    } catch (e) {
      const msg = e.code === "23505" ? "Certificate already exists" : String(e.message || "Generation failed").slice(0, 500);
      const nextStatus = e.status === 409 || e.code === "23505" ? "duplicate" : item.attempts + 1 >= 4 ? "failed" : "pending";
      await db.from("certificate_generation_job_items").update({ status: nextStatus, error_message: msg, updated_at: new Date().toISOString() }).eq("id", item.id);
    }
  }
  const [{ data: stats, error: se }, { count: total, error: te }] = await Promise.all([
    db.from("certificate_generation_job_items").select("status").eq("job_id", jobId),
    db.from("certificate_generation_job_items").select("id", { count: "exact", head: true }).eq("job_id", jobId),
  ]);
  if (se || te) throw se || te;
  const counts = Object.fromEntries(["succeeded", "failed", "pending", "processing", "invalid", "duplicate"].map((s) => [s, stats.filter((x) => x.status === s).length]));
  const done = counts.pending === 0 && counts.processing === 0;
  const status = done ? counts.failed ? "partial" : "completed" : "processing";
  const { data: updated, error: ue } = await db.from("certificate_generation_jobs").update({ succeeded_count: counts.succeeded, failed_count: counts.failed, duplicate_count: counts.duplicate, skipped_count: counts.invalid + counts.duplicate, status, completed_at: done ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", jobId).select("id,status,total_count,valid_count,invalid_count,duplicate_count,succeeded_count,failed_count,skipped_count").single();
  if (ue) throw ue;
  return json({ job: updated, processed: pending.length, remaining: Math.max(0, total - counts.succeeded - counts.failed - counts.invalid - counts.duplicate) });
}

async function downloadJobZip(ctx, admin, email, jobId, part) {
  const db = dbOf(ctx);
  const { data: job, error: jobError } = await db.from("certificate_generation_jobs").select("id,event_id,succeeded_count").eq("id", jobId).maybeSingle();
  if (jobError) throw jobError; if (!job) return json({ error: "Job not found." }, 404);
  const accessError = await requireEventAccess(ctx, admin, email, job.event_id); if (accessError) return accessError;
  const perPart = 25; const partCount = Math.ceil(job.succeeded_count / perPart);
  if (!Number.isInteger(part) || part < 1 || part > partCount) return json({ error: `ZIP part must be between 1 and ${partCount}.` }, 400);
  const { data: items, error } = await db.from("certificate_generation_job_items").select("certificate_id").eq("job_id", jobId).eq("status", "succeeded").order("row_number").range((part - 1) * perPart, part * perPart - 1);
  if (error) throw error;
  const ids = (items || []).map((item) => item.certificate_id).filter(Boolean);
  const { data: certs, error: certError } = await db.from("certificates").select("certificate_id,pdf_storage_path").in("id", ids);
  if (certError) throw certError;
  const zip = new JSZip();
  for (const cert of certs || []) {
    if (!cert.pdf_storage_path) continue;
    const { data: file, error: fileError } = await db.storage.from("certificate-files").download(cert.pdf_storage_path);
    if (fileError) throw fileError;
    zip.file(`${cert.certificate_id}.pdf`, Buffer.from(await file.arrayBuffer()));
  }
  const bytes = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 4 } });
  return new Response(bytes, { status: 200, headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="certificate-job-${jobId}-part-${part}.zip"`, "Cache-Control": "private, no-store" } });
}

async function verify(req, certificateId) {
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const now = Date.now(); const windowStart = now - 60_000;
  const hits = (verifyHits.get(ip) || []).filter((at) => at > windowStart);
  if (hits.length >= 60) return json({ error: "Too many verification requests. Try again shortly." }, 429, { "retry-after": "60" });
  hits.push(now); verifyHits.set(ip, hits);
  if (verifyHits.size > 5000) for (const [key, values] of verifyHits) if (!values.some((at) => at > windowStart)) verifyHits.delete(key);
  const webRequest = req instanceof Request ? req : await toWebRequest(req);
  const { data: ctx, error } = await createSupabaseContext(webRequest, { auth: "none" });
  if (error) return json({ error: "Verification service unavailable." }, 503);
  const db = ctx.supabase;
  const { data: records, error: queryError } = await db.rpc("verify_certificate", { p_certificate_id: certificateId });
  if (queryError) { console.error("Public verification lookup failed:", queryError); return json({ error: "Verification service unavailable." }, 503); }
  const data = records?.[0] || null;
  const adminDb = ctx.supabaseAdmin;
  let full = null;
  if (data) {
    const { data: found, error: fullError } = await adminDb.from("certificates").select("id,pdf_storage_path").eq("certificate_id", certificateId).maybeSingle();
    if (fullError) throw fullError;
    full = found;
  }
  const result = !data ? "not_found" : data.status === "revoked" ? "revoked" : "valid";
  await adminDb.from("certificate_verification_logs").insert({ certificate_id: full?.id || null, result });
  if (!data) return json({ status: "not_found" }, 404);
  let downloadUrl = null;
  if (data.status === "active") {
    // File access stays server-side; only a short-lived URL leaves this endpoint.
    if (full?.pdf_storage_path) {
      const { data: signed } = await adminDb.storage.from("certificate-files").createSignedUrl(full.pdf_storage_path, 300);
      downloadUrl = signed?.signedUrl || null;
    }
  }
  return json({ status: data.status === "revoked" ? "revoked" : "verified", certificate: { certificate_id: data.certificate_id, recipient_name: data.recipient_name, recipient_qid: data.recipient_qid, category: data.category, issue_date: data.issue_date, event_name: data.event_name, organization: data.organization, event_date: data.event_date, revoked_at: data.revoked_at }, download_url: downloadUrl });
}

async function body(req) { return readJson(await toWebRequest(req)); }
async function send(res, response) { res.statusCode = response.status; response.headers.forEach((value, key) => res.setHeader(key, value)); res.end(Buffer.from(await response.arrayBuffer())); }
