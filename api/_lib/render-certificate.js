import { PDFDocument, StandardFonts, rgb } from "pdf-lib/dist/pdf-lib.esm.js";
import QRCode from "qrcode";

const BUCKET = "certificate-files";
const SITE_URL = (process.env.PUBLIC_SITE_URL || "https://gdg-quantumuniversity.me").replace(/\/$/, "");
const hexColor = (value) => {
  const match = /^#?([0-9a-f]{6})$/i.exec(value || "");
  if (!match) return rgb(0.08, 0.12, 0.19);
  const hex = match[1];
  return rgb(parseInt(hex.slice(0, 2), 16) / 255, parseInt(hex.slice(2, 4), 16) / 255, parseInt(hex.slice(4, 6), 16) / 255);
};

const dateLabel = (date) => new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
  day: "numeric", month: "long", year: "numeric",
});

const drawField = (page, font, text, field, pageWidth, pageHeight) => {
  if (!text) return;
  const xPercent = Number.isFinite(Number(field?.x)) ? Number(field.x) : 50;
  const yPercent = Number.isFinite(Number(field?.y)) ? Number(field.y) : 50;
  const size = Math.min(96, Math.max(8, Number(field?.fontSize) || 18));
  const color = hexColor(field?.color);
  const width = font.widthOfTextAtSize(text, size);
  const align = ["left", "center", "right"].includes(field?.align) ? field.align : "center";
  const rawX = (Math.max(0, Math.min(100, xPercent)) / 100) * pageWidth;
  const x = align === "center" ? rawX - width / 2 : align === "right" ? rawX - width : rawX;
  const y = pageHeight - (Math.max(0, Math.min(100, yPercent)) / 100) * pageHeight - size / 2;
  page.drawText(text.slice(0, 200), { x: Math.max(0, x), y: Math.max(0, y), size, font, color });
};

export const verificationUrl = (certificateId) => `${SITE_URL}/verify/${encodeURIComponent(certificateId)}`;

export const renderAndStoreCertificate = async (db, certificate, event, template) => {
  const pdfDoc = await PDFDocument.create();
  const width = Number(template.page_width_mm || 297) * 72 / 25.4;
  const height = Number(template.page_height_mm || 210) * 72 / 25.4;
  const page = pdfDoc.addPage([width, height]);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  if (template.background_path) {
    const { data: background, error } = await db.storage.from(BUCKET).download(template.background_path);
    if (error) throw error;
    const bytes = Buffer.from(await background.arrayBuffer());
    const image = template.background_mime_type === "image/jpeg" || template.background_mime_type === "image/jpg"
      ? await pdfDoc.embedJpg(bytes)
      : await pdfDoc.embedPng(bytes);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  const design = template.design || {};
  const fields = design.fields || {};
  drawField(page, bold, certificate.recipient_name, fields.recipient || { x: 50, y: 43, fontSize: 34 }, width, height);
  drawField(page, regular, event.name, fields.event || { x: 50, y: 55, fontSize: 22 }, width, height);
  drawField(page, regular, certificate.category, fields.category || { x: 50, y: 65, fontSize: 16 }, width, height);
  drawField(page, regular, dateLabel(certificate.issue_date), fields.issueDate || { x: 50, y: 75, fontSize: 13 }, width, height);
  drawField(page, regular, certificate.certificate_id, fields.certificateId || { x: 50, y: 88, fontSize: 10 }, width, height);

  const qrBytes = await QRCode.toBuffer(verificationUrl(certificate.certificate_id), {
    errorCorrectionLevel: "H", margin: 2, width: 360, type: "png",
  });
  const qrImage = await pdfDoc.embedPng(qrBytes);
  const qrField = fields.qr || { x: 88, y: 82, size: 82 };
  const qrSize = Math.max(36, Math.min(180, Number(qrField.size) || 82));
  page.drawImage(qrImage, {
    x: width * (Number(qrField.x ?? 88) / 100) - qrSize / 2,
    y: height * (1 - Number(qrField.y ?? 82) / 100) - qrSize / 2,
    width: qrSize,
    height: qrSize,
  });

  (Array.isArray(template.signatories) ? template.signatories : []).slice(0, 4).forEach((signatory, index) => {
    if (!signatory?.name) return;
    const x = Number(signatory.x ?? (25 + index * 20)) / 100 * width;
    const y = height - Number(signatory.y ?? 88) / 100 * height;
    const nameSize = Math.max(8, Math.min(18, Number(signatory.fontSize) || 11));
    const nameWidth = bold.widthOfTextAtSize(String(signatory.name).slice(0, 100), nameSize);
    page.drawText(String(signatory.name).slice(0, 100), { x: x - nameWidth / 2, y, size: nameSize, font: bold, color: hexColor(signatory.color) });
    if (signatory.title) {
      const title = String(signatory.title).slice(0, 100);
      const titleWidth = regular.widthOfTextAtSize(title, 9);
      page.drawText(title, { x: x - titleWidth / 2, y: y - 12, size: 9, font: regular, color: hexColor(signatory.color) });
    }
  });

  pdfDoc.setTitle(`${certificate.recipient_name} — ${event.name}`);
  pdfDoc.setSubject(`Certificate ${certificate.certificate_id}`);
  pdfDoc.setCreator("GDG on Campus, Quantum University Certificate System");
  const pdfBytes = Buffer.from(await pdfDoc.save());
  const qrPath = `certificates/${certificate.issue_date.slice(0, 4)}/${event.id}/${certificate.certificate_id}.png`;
  const pdfPath = `certificates/${certificate.issue_date.slice(0, 4)}/${event.id}/${certificate.certificate_id}.pdf`;

  const qrUpload = await db.storage.from(BUCKET).upload(qrPath, qrBytes, {
    contentType: "image/png", upsert: true,
  });
  if (qrUpload.error) throw qrUpload.error;
  const pdfUpload = await db.storage.from(BUCKET).upload(pdfPath, pdfBytes, {
    contentType: "application/pdf", upsert: true,
  });
  if (pdfUpload.error) throw pdfUpload.error;

  return { pdf_storage_path: pdfPath, qr_storage_path: qrPath };
};
