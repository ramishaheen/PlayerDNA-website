// Vercel serverless function: emails PlayerDNA franchise enquiries via Resend.
//
// Env vars (set in Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   (required)  your Resend API key (already set for /api/certify)
//   FRANCHISE_TO     (optional)  inbox that receives enquiries.
//                                Default: CERTIFY_TO, else ramiblockchain2021@gmail.com
//                                (the Resend account email — the only address Resend
//                                delivers to until a domain is verified).
//   CERTIFY_FROM     (optional)  sender. Default: onboarding@resend.dev (test sender).

const clean = (v) => String(v == null ? "" : v).replace(/[^\x21-\x7E ]/g, "").trim();
const RESEND_API_KEY = clean(process.env.RESEND_API_KEY);
const FRANCHISE_TO = clean(process.env.FRANCHISE_TO) || clean(process.env.CERTIFY_TO) || "ramiblockchain2021@gmail.com";
const FRANCHISE_FROM = clean(process.env.CERTIFY_FROM) || "PlayerDNA Franchise <onboarding@resend.dev>";

const SITE = "https://playerdna-labs.vercel.app";
const LOGO = SITE + "/assets/img/logo-full.png";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

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
  const phone = str(body.phone);
  const company = str(body.company);
  const website = str(body.website);
  const country = str(body.country);
  const business = str(body.business);
  const experience = str(body.experience);
  const investment = str(body.investment);
  const timeline = str(body.timeline);
  const message = str(body.message);

  if (name.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (company.length < 2) return res.status(400).json({ error: "Please enter your company / organisation name." });
  if (country.length < 2) return res.status(400).json({ error: "Please enter your country or region of interest." });

  if (!RESEND_API_KEY) return res.status(200).json({ ok: false, needsSetup: true });

  try {
    const testMode = /resend\.dev/i.test(FRANCHISE_FROM);
    const firstName = name.split(" ")[0];

    const ownerBody = `
      <h1 style="margin:0 0 6px;color:#ffffff;font-size:20px;">New franchise enquiry</h1>
      <p style="margin:0 0 22px;color:#9fb0c3;font-size:14px;">A company just applied to franchise PlayerDNA in their region.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${detailRow("Contact", name)}${detailRow("Email", email)}${detailRow("Phone", phone)}${detailRow("Company", company)}${detailRow("Website", website)}${detailRow("Country / region", country)}${detailRow("Current business", business)}${detailRow("Experience", experience)}${detailRow("Investment capacity", investment)}${detailRow("Launch timeline", timeline)}${detailRow("Message", message)}
      </table>
      <a href="mailto:${esc(email)}" style="display:inline-block;margin-top:22px;background:#2ea0ff;color:#05080d;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;">Reply to ${esc(firstName)}</a>`;

    const owner = await sendEmail({
      from: FRANCHISE_FROM,
      to: [FRANCHISE_TO],
      reply_to: email,
      subject: `PlayerDNA Franchise — ${company} · ${country}`,
      html: shell(ownerBody),
    });

    if (!owner.ok) {
      return res.status(502).json({ error: (owner.data && owner.data.message) || "We couldn't send your enquiry right now. Please try again shortly." });
    }

    if (!testMode) {
      const applicantBody = `
        <h1 style="margin:0 0 6px;color:#ffffff;font-size:20px;">Franchise enquiry received &#9989;</h1>
        <p style="margin:0 0 18px;color:#cdd7e3;font-size:15px;">Hi ${esc(firstName)}, thanks for your interest in bringing <strong style="color:#7fc8ff;">PlayerDNA</strong> to your region.</p>
        <p style="margin:0 0 18px;color:#9fb0c3;font-size:14px;">We've received your enquiry for <strong style="color:#ffffff;">${esc(company)}</strong> (${esc(country)}). Our partnerships team reviews every enquiry and will be in touch with next steps.</p>
        <a href="${SITE}/franchise" style="display:inline-block;background:#2ea0ff;color:#05080d;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;">Learn more about partnering</a>`;
      try {
        await sendEmail({
          from: FRANCHISE_FROM,
          to: [email],
          subject: "We received your PlayerDNA franchise enquiry",
          html: shell(applicantBody),
        });
      } catch (_) { /* non-fatal */ }
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Server error sending your enquiry. Please try again shortly." });
  }
};
