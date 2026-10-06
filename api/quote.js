import formidable from "formidable";
import { Resend } from "resend";
import fs from "fs";

export const config = { api: { bodyParser: false } };

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const OK_EXT = /\.(docx|pdf|odt)$/i;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const form = formidable({ maxFileSize: 4 * 1024 * 1024, multiples: false });
    const [fields, files] = await form.parse(req);
    const f = k => (fields[k] && fields[k][0]) || "";
    if (!f("name") || !/^\S+@\S+\.\S+$/.test(f("email")) || !(+f("words") > 0))
      return res.status(400).json({ error: "Invalid data" });

    const file = files.file && files.file[0];
    if (file && !OK_EXT.test(file.originalFilename || ""))
      return res.status(400).json({ error: "Invalid file type" });

    const rows = ["name","email","phone","country","type","lang","words","service","cite","deadline","delivery","notes"]
      .map(k => `<tr><td><b>${k}</b></td><td>${esc(f(k))}</td></tr>`).join("");

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,            // e.g. "Scholara <orders@yourdomain.com>"
      to: process.env.TO_EMAIL,                // your inbox
      replyTo: f("email"),                     // reply goes straight to the customer
      subject: `Νέο αίτημα: ${f("service")} — ${f("words")} λέξεις — ${f("name")}`,
      html: `<table cellpadding="6" border="1" style="border-collapse:collapse">${rows}</table>`,
      attachments: file ? [{ filename: file.originalFilename, content: fs.readFileSync(file.filepath) }] : []
    });
    if (error) return res.status(502).json({ error: "Email failed" });
    return res.status(200).json({ ok: true });
  } catch (e) {
    const tooBig = e && e.code === 1009;
    return res.status(tooBig ? 413 : 500).json({ error: tooBig ? "File too large" : "Server error" });
  }
}
