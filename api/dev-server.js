import { createServer } from "node:http";
import isAdmin from "./user/isAdmin.js";
import certificateHandler from "./certificates/[...path].js";

const port = Number(process.env.ADMIN_API_PORT || 3001);

createServer(async (request, response) => {
  const path = request.url?.split("?")[0] || "/";
  const functionResponse = {
    statusCode: 200,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    end(body) { response.writeHead(this.statusCode, this.headers); response.end(body); },
  };
  try {
    if (path === "/api/user/isAdmin") return await isAdmin(request, functionResponse);
    if (path.startsWith("/api/certificates/")) {
      const suffix = path.slice("/api/certificates/".length).split("/").filter(Boolean);
      request.query = Object.fromEntries(new URL(request.url, "http://localhost").searchParams.entries());
      request.query.path = suffix;
      return await certificateHandler(request, functionResponse);
    }
    functionResponse.statusCode = 404;
    functionResponse.setHeader("Content-Type", "application/json");
    functionResponse.end(JSON.stringify({ error: "API route not found" }));
  } catch (error) {
    console.error("Local API failed:", error);
    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Local API failed" }));
    }
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Local API listening on http://127.0.0.1:${port}`);
});
