import { createSupabaseContext } from "@supabase/server";

export const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });

export const readJson = async (request) => {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 3_500_000) throw Object.assign(new Error("Request body is too large."), { status: 413 });
  const data = await request.json();
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Expected a JSON object.");
  }
  return data;
};

export const toWebRequest = async (req) => {
  const host = req.headers.host || "localhost";
  const forwardedProtocol = req.headers["x-forwarded-proto"];
  const protocol = forwardedProtocol || (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host) ? "http" : "https");
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (value != null) headers.set(key, Array.isArray(value) ? value.join(", ") : String(value));
  }

  let body;
  if (!["GET", "HEAD"].includes(req.method || "GET")) {
    if (req.body !== undefined) {
      if (Buffer.isBuffer(req.body) || typeof req.body === "string") body = req.body;
      else body = JSON.stringify(req.body);
    } else {
      const chunks = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      if (chunks.length) body = Buffer.concat(chunks);
    }
  }

  return new Request(new URL(req.url || "/", `${protocol}://${host}`), {
    method: req.method || "GET",
    headers,
    body,
    ...(body ? { duplex: "half" } : {}),
  });
};

export const sendNodeResponse = async (res, response) => {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  const body = Buffer.from(await response.arrayBuffer());
  res.end(body);
};

export const getAdminContext = async (request) => {
  const webRequest = request instanceof Request ? request : await toWebRequest(request);
  const { data: context, error } = await createSupabaseContext(webRequest, { auth: "user" });
  if (error) return { response: json({ error: "Authentication required." }, 401) };

  const email = context.userClaims?.email?.trim().toLowerCase();
  if (!email) return { response: json({ error: "A verified account email is required." }, 403) };

  const { data: admin, error: adminError } = await context.supabaseAdmin
    .from("admin_users")
    .select("email, role, is_active")
    .eq("email", email)
    .maybeSingle();

  if (adminError) {
    console.error("Certificate admin lookup failed:", adminError);
    return { response: json({ error: "Admin access is not configured. Apply the certificate SQL setup." }, 503) };
  }
  if (!admin || !admin.is_active) return { response: json({ error: "Admin access denied." }, 403) };
  return { context, admin, email };
};

export const hasRole = (admin, allowed) =>
  admin.role === "super_admin" || allowed.includes(admin.role);

export const requireRoles = (admin, allowed) =>
  hasRole(admin, allowed) ? null : json({ error: "Your admin role does not allow this action." }, 403);

export const requireEventAccess = async (context, admin, email, eventId) => {
  if (admin.role !== "event_manager") return null;
  const { data, error } = await context.supabaseAdmin
    .from("certificate_event_access")
    .select("event_id")
    .eq("event_id", eventId)
    .eq("admin_email", email)
    .maybeSingle();
  if (error) {
    console.error("Certificate event access lookup failed:", error);
    return json({ error: "Could not verify event access." }, 500);
  }
  return data ? null : json({ error: "You do not have access to this event." }, 403);
};

export const writeAudit = async (db, { actorId, actorEmail, action, targetType, targetId, metadata = {} }) => {
  const { error } = await db.from("certificate_audit_logs").insert({
    actor_id: actorId || null,
    actor_email: actorEmail || null,
    action,
    target_type: targetType,
    target_id: targetId == null ? null : String(targetId),
    metadata,
  });
  if (error) throw error;
};

export const cleanText = (value, max = 255) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export const isEmail = (value) =>
  typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
