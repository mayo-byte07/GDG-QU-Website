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

  const authorization = req.headers.authorization || "";
  const accessToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return json(res, 500, { error: "Supabase server configuration is missing" });
  }
  if (!accessToken) return json(res, 401, { error: "Sign-in required" });

  try {
    const userResponse = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) return json(res, 401, { error: "Invalid or expired session" });

    const user = await userResponse.json();
    const allowedEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const email = user.email?.trim().toLowerCase();

    return json(res, 200, {
      data: { isAdmin: Boolean(email && allowedEmails.includes(email)) },
    });
  } catch (error) {
    console.error("Admin authorization check failed:", error);
    return json(res, 502, { error: "Could not verify the Supabase session" });
  }
}
