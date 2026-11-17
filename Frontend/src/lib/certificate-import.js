export function parseCsv(text) {
  const rows = []; let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted && c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
    else if (c === '"') quoted = !quoted;
    else if (!quoted && c === ",") { row.push(cell); cell = ""; }
    else if (!quoted && (c === "\n" || c === "\r")) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); if (row.some((value) => value.trim())) rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); if (row.some((value) => value.trim())) rows.push(row); }
  return rows;
}

export function mapRows(headers, rows, mapping, fallbackCategory = "Participant") {
  const nameIndex = Number(mapping.name); const emailIndex = Number(mapping.email);
  const categoryIndex = mapping.category === "" || mapping.category == null ? null : Number(mapping.category);
  return rows.map((row) => ({
    name: String(row[nameIndex] ?? "").trim(),
    email: String(row[emailIndex] ?? "").trim(),
    category: categoryIndex == null ? fallbackCategory : (String(row[categoryIndex] ?? "").trim() || fallbackCategory),
  }));
}
