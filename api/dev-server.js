import { createServer } from "node:http";
import isAdmin from "./user/isAdmin.js";

const port = Number(process.env.ADMIN_API_PORT || 3001);

createServer(async (request, response) => {
  if (request.url?.split("?")[0] !== "/api/user/isAdmin") {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "API route not found" }));
    return;
  }

  const functionResponse = {
    statusCode: 200,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    end(body) {
      response.writeHead(this.statusCode, this.headers);
      response.end(body);
    },
  };

  try {
    await isAdmin(request, functionResponse);
  } catch (error) {
    console.error("Local admin API failed:", error);
    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Local admin API failed" }));
    }
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Local admin API listening on http://127.0.0.1:${port}`);
});
