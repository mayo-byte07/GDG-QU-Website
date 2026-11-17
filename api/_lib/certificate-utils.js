import { randomBytes } from "node:crypto";

export const CATEGORIES = Object.freeze(["Participant", "Winner", "Runner-up", "Volunteer", "Organizer", "Speaker", "Mentor", "Core Team", "Special Recognition"]);
export const newCertificateId = (year = new Date().getFullYear()) => `GDGQU-${year}-${randomBytes(8).toString("hex").toUpperCase()}`;
export const isCertificateId = (value) => /^GDGQU-\d{4}-[A-F0-9]{16}$/.test(value);
export const normalizeParticipant = (record, fallbackCategory = "Participant") => {
  const name = typeof (record?.name ?? record?.recipient_name) === "string" ? (record.name ?? record.recipient_name).trim().slice(0, 160) : "";
  const email = typeof (record?.email ?? record?.recipient_email) === "string" ? (record.email ?? record.recipient_email).trim().toLowerCase().slice(0, 254) : "";
  const category = typeof record?.category === "string" && record.category.trim() ? record.category.trim().slice(0, 80) : fallbackCategory;
  const errors = [];
  if (name.length < 2) errors.push("Name is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email is required");
  if (!CATEGORIES.includes(category)) errors.push("Unsupported category");
  return { name, email, category, errors };
};

export const classifyParticipants = (records, fallbackCategory = "Participant") => {
  const seen = new Set();
  let invalid = 0;
  let duplicate = 0;
  const participants = records.map((record, index) => {
    const row = normalizeParticipant(record, fallbackCategory);
    let status = row.errors.length ? "invalid" : "pending";
    if (status === "invalid") invalid++;
    else {
      const key = `${row.email}|${row.category.toLowerCase()}`;
      if (seen.has(key)) { status = "duplicate"; duplicate++; } else seen.add(key);
    }
    return { ...row, row_number: index + 2, status };
  });
  return { participants, valid: records.length - invalid - duplicate, invalid, duplicate };
};
