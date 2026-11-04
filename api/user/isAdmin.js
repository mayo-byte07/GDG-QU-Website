import { verifyAuth } from "@supabase/server/core";

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

  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host || "localhost";
  const headers = new Headers();
  if (req.headers.authorization) headers.set("Authorization", req.headers.authorization);
  if (req.headers.apikey) headers.set("apikey", req.headers.apikey);
  const request = new Request(`${protocol}://${host}${req.url || "/api/user/isAdmin"}`, {
    method: "GET",
    headers,
  });

  try {
    const { data: auth, error } = await verifyAuth(request, {
      auth: "user",
    });
    if (error) return json(res, error.status || 401, { error: error.message });

    const allowedEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const email = auth.userClaims?.email?.trim().toLowerCase();

    return json(res, 200, {
      data: { isAdmin: Boolean(email && allowedEmails.includes(email)) },
    });
  } catch (error) {
    console.error("Admin authorization check failed:", error);
    return json(res, 502, { error: "Could not verify the Supabase session" });
  }
}
