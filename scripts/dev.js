import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const run = (args, cwd) => spawn(process.execPath, args, { cwd, stdio: "inherit" });

const api = run([
  `--env-file-if-exists=${resolve(root, ".env")}`,
  resolve(root, "api/dev-server.js"),
], root);
const frontend = run([
  resolve(root, "Frontend/node_modules/vite/bin/vite.js"),
  "--host",
], resolve(root, "Frontend"));

let stopping = false;
const stop = (code = 0) => {
  if (stopping) return;
  stopping = true;
  api.kill();
  frontend.kill();
  process.exitCode = code;
};

api.on("error", (error) => { console.error("Could not start admin API:", error); stop(1); });
frontend.on("error", (error) => { console.error("Could not start Vite:", error); stop(1); });
api.on("exit", (code) => { if (!stopping) stop(code || 0); });
frontend.on("exit", (code) => { if (!stopping) stop(code || 0); });
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
