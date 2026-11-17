import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";
import "./certificate-admin.css";

export default function CertificateVerification() {
  const { certificateId } = useParams(); const [result, setResult] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; fetch(`/api/certificates/verify/${encodeURIComponent(certificateId)}`).then(async (r) => ({ data: await r.json(), status: r.status })).then(({ data }) => { if (active) setResult(data); }).catch(() => { if (active) setResult({ status: "unavailable" }); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [certificateId]);
  const good = result?.status === "verified"; const revoked = result?.status === "revoked";
  return <main className="cert-verify"><article className="cert-verify-card"><span className="cert-kicker">GDG QUANTUM UNIVERSITY</span>{loading ? <><div className="cert-spinner" /><h1>Checking certificate…</h1></> : <><div className={`verify-icon ${good ? "good" : revoked ? "bad" : "unknown"}`}>{good ? <FaCheckCircle /> : revoked ? <FaTimesCircle /> : <FaQuestionCircle />}</div><h1>{good ? "Certificate verified" : revoked ? "Certificate revoked" : result?.status === "not_found" ? "Certificate not found" : "Verification unavailable"}</h1>{result?.certificate && <><p>This certificate {good ? "is valid" : "is no longer valid"}.</p><dl><dt>Recipient</dt><dd>{result.certificate.recipient_name}</dd><dt>Event</dt><dd>{result.certificate.event_name}</dd><dt>Category</dt><dd>{result.certificate.category}</dd><dt>Issue date</dt><dd>{result.certificate.issue_date}</dd><dt>Certificate ID</dt><dd>{result.certificate.certificate_id}</dd>{revoked && <><dt>Revoked on</dt><dd>{result.certificate.revoked_at}</dd></>}</dl>{good && result.download_url && <a className="cert-primary-link" href={result.download_url} target="_blank" rel="noreferrer">Download certificate PDF</a>}</>}</>}</article></main>;
}
