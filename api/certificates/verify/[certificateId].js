import certificatesHandler from "../[...path].js";

export default async function handler(req, res) {
  const certificateId = req.query?.certificateId;
  if (typeof certificateId !== "string" || !certificateId) {
    res.statusCode = 400;
    res.setHeader("content-type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({ error: "Certificate ID is required." }));
  }
  req.query = { ...req.query, path: ["verify", certificateId] };
  return certificatesHandler(req, res);
}
