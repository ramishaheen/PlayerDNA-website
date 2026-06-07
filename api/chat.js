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
var ANTHROPIC_MODEL = clean(process.env.ANTHROPIC_MODEL) || "claude-3-5-haiku-latest";
var GEMINI_MODEL = clean(process.env.GEMINI_MODEL) || "gemini-2.0-flash";
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
  '- Certification / enrollment: 3 levels — Certified Analyst (Foundation), Performance Specialist (Advanced), PlayerDNA Partner (Expert). Certified people join a talent network and can earn from their first engagement. They apply on the certification page.',
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
function pickProvider() {
  if (PROVIDER === "anthropic" && ANTHROPIC_KEY) return "anthropic";
  if (PROVIDER === "gemini" && GEMINI_KEY) return "gemini";
  if (PROVIDER === "openai" && OPENAI_KEY) return "openai";
  if (ANTHROPIC_KEY) return "anthropic";
  if (GEMINI_KEY) return "gemini";
  if (OPENAI_KEY) return "openai";
  return null;
}

module.exports = async function (req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }
  var body = req.body;
  if (!body || typeof body !== "object") { try { body = JSON.parse(await streamToString(req)); } catch (_) { body = {}; } }
  var messages = sanitize(body.messages);
  if (!messages.length) return res.status(400).json({ error: "No message." });

  var provider = pickProvider();
  if (!provider) return res.status(200).json({ needsSetup: true });

  try {
    if (provider === "anthropic") {
      var r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: ANTHROPIC_MODEL, max_tokens: 400, system: SYSTEM, messages: messages })
      });
      var data = await r.json().catch(function () { return {}; });
      if (r.ok && data.content && data.content[0] && data.content[0].text) return res.status(200).json({ reply: data.content[0].text, via: "anthropic" });
      return res.status(502).json({ error: (data.error && data.error.message) || "AI service error." });
    }

    if (provider === "gemini") {
      var contents = messages.map(function (m) { return { role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }; });
      var gr = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent", {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": GEMINI_KEY },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: contents,
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 }
        })
      });
      var gd = await gr.json().catch(function () { return {}; });
      var cand = gd.candidates && gd.candidates[0];
      var gtext = cand && cand.content && cand.content.parts && cand.content.parts[0] && cand.content.parts[0].text;
      if (gr.ok && gtext) return res.status(200).json({ reply: gtext, via: "gemini" });
      return res.status(502).json({ error: (gd.error && gd.error.message) || "AI service error." });
    }

    // openai
    var msgs = [{ role: "system", content: SYSTEM }].concat(messages);
    var r2 = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + OPENAI_KEY, "content-type": "application/json" },
      body: JSON.stringify({ model: OPENAI_MODEL, max_tokens: 400, messages: msgs })
    });
    var d2 = await r2.json().catch(function () { return {}; });
    if (r2.ok && d2.choices && d2.choices[0] && d2.choices[0].message) return res.status(200).json({ reply: d2.choices[0].message.content, via: "openai" });
    return res.status(502).json({ error: (d2.error && d2.error.message) || "AI service error." });
  } catch (e) {
    return res.status(500).json({ error: "Server error contacting the AI service." });
  }
};
