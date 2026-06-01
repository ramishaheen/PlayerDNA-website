// Vercel serverless function: emails PlayerDNA certification applications via Resend.
//
// Env vars (set in Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   (required)  your Resend API key
//   CERTIFY_TO       (optional)  inbox that receives applications.
//                                Default: ramiblockchain2021@gmail.com (the Resend
//                                account email — the only address Resend delivers to
//                                until a domain is verified).
//   CERTIFY_FROM     (optional)  sender. Default: onboarding@resend.dev (test sender).
//                                After you verify a domain at resend.com/domains,
//                                set this to e.g. "PlayerDNA <noreply@yourdomain.com>"
//                                and applicant confirmation emails switch on automatically,
//                                and you can set CERTIFY_TO to dr.rami.b.h@gmail.com.

// Strip any BOM / non-printable chars (env values piped in can carry a UTF-8 BOM).
const clean = (v) => String(v == null ? "" : v).replace(/[^\x21-\x7E ]/g, "").trim();
const RESEND_API_KEY = clean(process.env.RESEND_API_KEY);
const CERTIFY_TO = clean(process.env.CERTIFY_TO) || "ramiblockchain2021@gmail.com";
const CERTIFY_FROM = clean(process.env.CERTIFY_FROM) || "PlayerDNA Certification <onboarding@resend.dev>";

const SITE = "https://playerdna-labs.vercel.app";
const LOGO = SITE + "/assets/img/logo-full.png";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Branded, email-client-safe shell (dark theme + logo, table layout, inline styles).
function shell(bodyHtml) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#05080d;">
  <div style="background:#05080d;padding:30px 14px;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#0b121c;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
      <tr><td style="background:#060a12;padding:24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
        <img src="${LOGO}" alt="PLAYER DNA — AI Solutions for Athletes" width="200" style="display:block;margin:0 auto;max-width:200px;height:auto;border:0;" />
      </td></tr>
      <tr><td style="padding:30px;color:#cdd7e3;font-size:15px;line-height:1.6;">${bodyHtml}</td></tr>
      <tr><td style="background:#060a12;padding:18px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
        <p style="margin:0;color:#5c6b7e;font-size:12px;letter-spacing:0.04em;">PlayerDNA Labs &middot; AI Solutions for Athletes</p>
        <p style="margin:6px 0 0;"><a href="${SITE}" style="color:#2ea0ff;font-size:12px;text-decoration:none;">playerdna-labs.vercel.app</a></p>
      </td></tr>
    </table>
  </div></body></html>`;
}

function detailRow(label, val) {
  if (!val) return "";
  return `<tr>
    <td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#8a99ab;font-size:13px;width:38%;vertical-align:top;">${esc(label)}</td>
    <td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#ffffff;font-size:14px;">${esc(val)}</td>
  </tr>`;
}

async function sendEmail(payload) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

function streamToString(req) {
  return new Promise((resolve, reject) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => resolve(d));
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (!body || typeof body !== "object") {
    try { body = JSON.parse(await streamToString(req)); } catch { body = {}; }
  }

  const str = (v) => (v == null ? "" : String(v).trim());
  const name = str(body.name);
  const email = str(body.email);
  const level = str(body.level);
  const phone = str(body.phone);
  const country = str(body.country);
  const experience = str(body.experience);
  const motivation = str(body.motivation);

  if (name.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (!level) return res.status(400).json({ error: "Please choose a certification level." });

  if (!RESEND_API_KEY) return res.status(200).json({ ok: false, needsSetup: true });

  try {
  const testMode = /resend\.dev/i.test(CERTIFY_FROM);
  const firstName = name.split(" ")[0];

  // ---- Owner notification (branded) ----
  const ownerBody = `
    <h1 style="margin:0 0 6px;color:#ffffff;font-size:20px;">New certification application</h1>
    <p style="margin:0 0 22px;color:#9fb0c3;font-size:14px;">Someone just applied through the PlayerDNA certification page.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${detailRow("Name", name)}${detailRow("Email", email)}${detailRow("Phone", phone)}${detailRow("Country", country)}${detailRow("Level", level)}${detailRow("Experience", experience)}${detailRow("Motivation", motivation)}
    </table>
    <a href="mailto:${esc(email)}" style="display:inline-block;margin-top:22px;background:#2ea0ff;color:#05080d;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;">Reply to ${esc(firstName)}</a>`;

  const owner = await sendEmail({
    from: CERTIFY_FROM,
    to: [CERTIFY_TO],
    reply_to: email,
    subject: `PlayerDNA Certification — ${name} · ${level}`,
    html: shell(ownerBody),
  });

  if (!owner.ok) {
    return res.status(502).json({ error: (owner.data && owner.data.message) || "We couldn't send your application right now. Please try again shortly." });
  }

  // ---- Applicant confirmation (branded) — only once a real domain is configured ----
  if (!testMode) {
    const applicantBody = `
      <h1 style="margin:0 0 6px;color:#ffffff;font-size:20px;">Application received &#9989;</h1>
      <p style="margin:0 0 18px;color:#cdd7e3;font-size:15px;">Hi ${esc(firstName)}, thanks for applying to <strong style="color:#7fc8ff;">PlayerDNA Certification</strong>.</p>
      <p style="margin:0 0 18px;color:#9fb0c3;font-size:14px;">We've received your application for <strong style="color:#ffffff;">${esc(level)}</strong>. Our team reviews every application and will email you next steps and pricing shortly.</p>
      <p style="margin:0 0 6px;color:#8a99ab;font-size:13px;">What happens next:</p>
      <ul style="margin:0 0 18px;padding-left:18px;color:#cdd7e3;font-size:14px;line-height:1.7;">
        <li>We review your background &amp; chosen level</li>
        <li>You get your onboarding link &amp; pricing</li>
        <li>Once certified, you join our talent network &amp; start earning</li>
      </ul>
      <a href="${SITE}/certify.html" style="display:inline-block;background:#2ea0ff;color:#05080d;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;">View certification details</a>`;
    try {
      await sendEmail({
        from: CERTIFY_FROM,
        to: [email],
        subject: "We received your PlayerDNA certification application",
        html: shell(applicantBody),
      });
    } catch (_) { /* non-fatal */ }
  }

  return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Server error sending your application. Please try again shortly." });
  }
};
