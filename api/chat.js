// Vercel serverless function: "Windy" — the PlayerDNA AI assistant.
// Picks a provider from whichever key is set (override with CHAT_PROVIDER):
//   ANTHROPIC_API_KEY  -> Claude   (default model: claude-3-5-haiku-latest)
//   GEMINI_API_KEY     -> Gemini   (default model: gemini-2.0-flash)  [GOOGLE_API_KEY also accepted]
//   OPENAI_API_KEY     -> GPT      (default model: gpt-4o-mini)
// Set one in Vercel -> Settings -> Environment Variables (Production), then redeploy.
// With no key it returns { needsSetup: true } and the page falls back to scripted answers.

var clean = function (v) { return String(v == null ? "" : v).replace(/[^\x21-\x7E]/g, "").trim(); };
var ANTHROPIC_KEY = clean(process.env.ANTHROPIC_API_KEY);
var OPENAI_KEY = clean(process.env.OPENAI_API_KEY);
var GEMINI_KEY = clean(process.env.GEMINI_API_KEY) || clean(process.env.GOOGLE_API_KEY);
var PROVIDER = clean(process.env.CHAT_PROVIDER).toLowerCase(); // optional: "anthropic" | "gemini" | "openai"
var ANTHROPIC_MODEL = clean(process.env.ANTHROPIC_MODEL) || "claude-3-haiku-20240307";
var GEMINI_MODELS = [clean(process.env.GEMINI_MODEL), "gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash-8b", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"].filter(Boolean);
var OPENAI_MODEL = clean(process.env.OPENAI_MODEL) || "gpt-4o-mini";

var SYSTEM = [
  'You are "Windy", the friendly AI assistant on the PlayerDNA Labs website — an AI athlete-intelligence platform for football (soccer).',
  '',
  'ABOUT PLAYERDNA:',
  '- It turns a single training or match video into a complete athlete profile — movement, speed, power, stamina, agility, biomechanics and injury risk — and recommends the football positions a player is built for. Camera AI estimates from video; professional hardware confirms with ground-truth measurement.',
  '- Process: 1) Capture a video, live session or guided self-assessment. 2) AI tracks movement & body pose. 3) It scores 16 dimensions. 4) You get a best-position fit (top 3 positions, with reasons) and a personalized development plan.',
  '- Three modes: Camera-Only (AI estimated, any phone, no hardware), Hybrid Performance (adds HR/GPS/timing gates/body-composition), Elite Ground-Truth (force plates, VO2 max, lactate, ECG).',
  '- Pricing: Camera AI Starter is $200 per user per year. Hybrid Performance is custom per squad. Elite Ground-Truth is enterprise. For a quote, suggest booking a demo.',
  '- 18 validated tests: 30 m sprint, Illinois agility, vertical jump (CMJ), Yo-Yo/20m MSFT (VO2max), handgrip dynamometry, 2D video kinematics, postural screen + Foot Posture Index, reaction-time & scanning, ISAK + WHO/CDC BMI, FMS + Y-Balance, hop-test LSI (>=90%), Bosco index, plus football-skill tests (dribbling speed, shooting, passing) and a neuroscience/cognitive test, LTAD pathway, 16-dimension fit model.',
  '- Hardware: none needed to start — Camera-Only runs on any phone. Sensors/lab gear are optional in higher tiers.',
  '- Injury risk: screening flags asymmetry, fatigue and overload as INDICATORS that prompt professional review — never a medical diagnosis.',
  '- Youth: for ages 6-16 a dedicated youth mode focuses on healthy development and a long-term pathway, with a parent-friendly summary.',
  '- Who it is for: parents & young players, academies & clubs, and elite teams.',
  '- Certification / enrollment: every level first requires IAIDL Basic — the accredited International AI Driving License foundation (a prerequisite for all levels). The 3 levels are AI Football Analyst (Foundation), Senior AI Performance Analyst (Advanced) and AI Scouting Coach (Expert). Certified people join a talent network and can earn from their first engagement; they apply on the certification page.',
  '- Data is stored securely and used only for that athlete profile; youth needs guardian consent.',
  '',
  'STYLE & RULES:',
  '- Be warm, concise (1-4 short sentences) and helpful. An occasional emoji is fine.',
  '- ONLY answer questions about PlayerDNA (the system, process, tests, pricing, positions, certification, the company).',
  '- If the user asks something off-topic or unrelated (weather, jokes, general knowledge, other companies, coding, etc.), briefly and politely say it is outside your scope and steer them back to PlayerDNA. Do NOT answer off-topic questions.',
  '- You cannot perform actions or access user data. For next steps, point users to "book a demo" or "get certified" on the site.',
  '- Never invent features, prices or guarantees beyond the facts above. If unsure, suggest booking a demo.'
].join("\n");

function streamToString(req) {
  return new Promise(function (resolve, reject) {
    var d = ""; req.on("data", function (c) { d += c; }); req.on("end", function () { resolve(d); }); req.on("error", reject);
  });
}
function sanitize(messages) {
  if (!Array.isArray(messages)) return [];
  var out = [];
  for (var i = 0; i < messages.length; i++) {
    var m = messages[i];
    if (!m || (m.role !== "user" && m.role !== "assistant")) continue;
    var c = String(m.content == null ? "" : m.content).slice(0, 2000);
    if (c) out.push({ role: m.role, content: c });
  }
  out = out.slice(-12);                                  // cap history length
  while (out.length && out[0].role !== "user") out.shift(); // must start with a user turn
  return out;
}
async function callAnthropic(messages) {
  var r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: ANTHROPIC_MODEL, max_tokens: 400, system: SYSTEM, messages: messages })
  });
  var data = await r.json().catch(function () { return {}; });
  if (r.ok && data.content && data.content[0] && data.content[0].text) return data.content[0].text;
  throw new Error("anthropic: " + ((data.error && data.error.message) || ("HTTP " + r.status)));
}
async function callGemini(messages) {
  var contents = messages.map(function (m) { return { role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }; });
  var body = JSON.stringify({ system_instruction: { parts: [{ text: SYSTEM }] }, contents: contents, generationConfig: { maxOutputTokens: 400, temperature: 0.7 } });
  var lastErr = "";
  for (var k = 0; k < GEMINI_MODELS.length; k++) {
    var gr = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODELS[k] + ":generateContent", {
      method: "POST", headers: { "content-type": "application/json", "x-goog-api-key": GEMINI_KEY }, body: body
    });
    var gd = await gr.json().catch(function () { return {}; });
    var cand = gd.candidates && gd.candidates[0];
    var gtext = cand && cand.content && cand.content.parts && cand.content.parts[0] && cand.content.parts[0].text;
    if (gr.ok && gtext) return gtext;
    lastErr = (gd.error && gd.error.message) || ("HTTP " + gr.status);
    if (gr.status === 400 || gr.status === 403) break; // bad key / request — other models won't help
  }
  throw new Error("gemini: " + lastErr);
}
async function callOpenAI(messages) {
  var msgs = [{ role: "system", content: SYSTEM }].concat(messages);
  var r2 = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + OPENAI_KEY, "content-type": "application/json" },
    body: JSON.stringify({ model: OPENAI_MODEL, max_tokens: 400, messages: msgs })
  });
  var d2 = await r2.json().catch(function () { return {}; });
  if (r2.ok && d2.choices && d2.choices[0] && d2.choices[0].message) return d2.choices[0].message.content;
  throw new Error("openai: " + ((d2.error && d2.error.message) || ("HTTP " + r2.status)));
}

// Default order: Gemini first (free + reliable), then Anthropic, then OpenAI.
// CHAT_PROVIDER forces a single provider. Providers without a key are skipped.
function providerOrder() {
  var avail = { anthropic: !!ANTHROPIC_KEY, gemini: !!GEMINI_KEY, openai: !!OPENAI_KEY };
  if (PROVIDER && avail[PROVIDER]) return [PROVIDER];
  return ["gemini", "anthropic", "openai"].filter(function (p) { return avail[p]; });
}

module.exports = async function (req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  var body = req.body;
  if (!body || typeof body !== "object") { try { body = JSON.parse(await streamToString(req)); } catch (_) { body = {}; } }
  var messages = sanitize(body.messages);
  if (!messages.length) return res.status(400).json({ error: "No message." });

  var order = providerOrder();
  if (!order.length) return res.status(200).json({ needsSetup: true });

  var callers = { anthropic: callAnthropic, gemini: callGemini, openai: callOpenAI };
  var errs = [];
  for (var i = 0; i < order.length; i++) {
    try {
      var reply = await callers[order[i]](messages);
      if (reply) return res.status(200).json({ reply: reply, via: order[i] });
    } catch (e) { errs.push(String((e && e.message) || e)); }
  }
  if (errs.length) console.error("Windy AI providers failed:", errs.join(" | "));
  return res.status(502).json({ error: "Windy is briefly unavailable — please try again." });
};
