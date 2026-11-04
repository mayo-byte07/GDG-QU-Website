import { createSupabaseContext } from "@supabase/server";

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

export default async function isAdmin(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed" });
  }

  const host = req.headers.host || "localhost";
  const protocol = req.headers["x-forwarded-proto"] ||
    (/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host) ? "http" : "https");
  const headers = new Headers();
  if (req.headers.authorization) headers.set("Authorization", req.headers.authorization);
  if (req.headers.apikey) headers.set("apikey", req.headers.apikey);
  const request = new Request(`${protocol}://${host}${req.url || "/api/user/isAdmin"}`, {
    method: "GET",
    headers,
  });

  try {
    const { data: context, error } = await createSupabaseContext(request, {
      auth: "user",
    });
    if (error) return json(res, error.status || 401, { error: error.message });

    const email = context.userClaims?.email?.trim().toLowerCase();
    if (!email) return json(res, 200, { data: { isAdmin: false } });

    const { data: admin, error: databaseError } = await context.supabaseAdmin
      .from("admin_users")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    if (databaseError) {
      console.error("Admin allowlist query failed:", databaseError);
      return json(res, 500, { error: "Could not check admin access" });
    }

    return json(res, 200, {
      data: { isAdmin: Boolean(admin) },
    });
  } catch (error) {
    console.error("Admin authorization check failed:", error);
    return json(res, 502, { error: "Could not verify the Supabase session" });
  }
}
