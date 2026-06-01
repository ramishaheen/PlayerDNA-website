/* PlayerDNA AI assistant — lead-gated, rule-based chatbot about the system, process & enrollment. */
(function () {
  "use strict";
  var launch = document.getElementById("cbotLaunch");
  var panel = document.getElementById("cbotPanel");
  if (!launch || !panel) return;
  var closeBtn = document.getElementById("cbotClose");
  var gate = document.getElementById("cbotGate");
  var chat = document.getElementById("cbotChat");
  var leadForm = document.getElementById("cbotLead");
  var gateMsg = document.getElementById("cbotGateMsg");
  var messages = document.getElementById("cbotMessages");
  var quick = document.getElementById("cbotQuick");
  var inputForm = document.getElementById("cbotInputForm");
  var input = document.getElementById("cbotInput");

  var KB = [
    { k: ["hello", "hi ", "hey", "good morning", "good evening", "salam"], a: "Hey! 👋 Ask me about how PlayerDNA works, the tests, pricing, or how to get certified." },
    { k: ["what is", "what's", "about", "who are you", "what do you do", "the system", "explain", "tell me about"], a: "PlayerDNA turns a single training or match video into a complete athlete profile — speed, power, stamina, biomechanics and injury risk — then recommends the football positions a player is built for. Camera AI estimates it; hardware confirms it." },
    { k: ["how does", "how it work", "how do you", "how do i use", "process", "pipeline", "steps", "work"], a: "Four steps: <b>1)</b> Capture a video, live session or self-assessment · <b>2)</b> AI tracks movement &amp; body pose · <b>3)</b> It scores 16 dimensions (speed, power, stamina, agility…) · <b>4)</b> You get a best-position fit and a personalized plan." },
    { k: ["price", "pricing", "cost", "how much", "fee", "pay", "subscription", "$", "dollar"], a: "Camera AI Starter is <b>$200 per user / year</b>. Hybrid Performance is custom per squad, and Elite Ground-Truth is enterprise. Want me to open the demo form? <a href='#' data-open-demo>Book a demo →</a>" },
    { k: ["hardware", "equipment", "device", "phone", "camera", "buy", "sensor", "gear"], a: "No hardware needed to start — Camera-Only mode runs on any phone. Sensors, GPS and lab gear are optional and added in the higher tiers as you grow." },
    { k: ["test", "tests", "assessment", "protocol", "measure", "metric", "battery"], a: "We use 14 validated protocols — 30 m sprint, Illinois agility, vertical jump (CMJ), Yo-Yo / VO₂max, handgrip, FMS + Y-Balance, hop-test, reaction time, posture / FPI, anthropometry and more — all mapped to one athlete profile." },
    { k: ["position", "positions", "where should", "best fit", "role", "winger", "striker", "defender"], a: "The engine scores all eight football positions and returns your top three — each with the reasoning behind it, never a single number in isolation." },
    { k: ["certif", "enroll", "course", "training", "become", "get certified", "job", "earn", "money", "resource", "academy", "career"], a: "You can get certified across <b>3 levels</b> (Analyst → Performance Specialist → PlayerDNA Partner), join our talent network and earn from your first engagement. <a href='certify.html' target='_blank' rel='noopener'>See the certification page →</a>" },
    { k: ["injury", "injuries", "risk", "hurt", "safe", "safety", "medical", "diagnos"], a: "Injury-risk screening flags asymmetry, fatigue and overload early. These are indicators that prompt professional review — never a medical diagnosis." },
    { k: ["demo", "book", "contact", "talk", "sales", "reach", "speak", "call", "meeting"], a: "Happy to help! You can <a href='#' data-open-demo>book a 10-minute demo</a> and our team will walk you through everything." },
    { k: ["accurate", "accuracy", "reliable", "trust", "precise", "valid"], a: "Camera AI gives movement <b>estimates</b> from video; professional hardware adds <b>ground-truth</b> measurement. We combine both — estimate first, confirm with hardware when it matters." },
    { k: ["youth", "kid", "child", "young", "age", "u15", "u12", "u9", "junior"], a: "Yes — for players aged 6–16 a dedicated youth mode focuses on healthy development and a long-term pathway, with a parent-friendly summary." },
    { k: ["data", "privacy", "gdpr", "secure", "store", "gdpr"], a: "Athlete data is stored securely and used only to produce that player's profile. Youth profiles need guardian consent, and you control who can access each athlete." },
    { k: ["who is it for", "who for", "parent", "scout", "coach", "club", "school"], a: "Everyone in the game — parents &amp; young players, academies &amp; clubs, and elite teams. One platform that meets each where they are." },
    { k: ["thank", "thanks", "cheers", "appreciate", "great", "awesome", "perfect"], a: "You're welcome! ⚽ Anything else about the system, the tests or getting certified?" }
  ];
  var FALLBACK = "That's a little outside my scope 🙂 — I'm <b>Windy</b>, the PlayerDNA assistant, so I can only help with PlayerDNA: the system, the tests, pricing, positions, and getting certified. Try one of those, or <a href='#' data-open-demo>book a demo</a> to talk to the team.";
  var QUICK = ["How does it work?", "Pricing?", "How do I get certified?", "What tests?", "Do I need hardware?"];

  function getLead() { try { return JSON.parse(localStorage.getItem("pdna_chat_lead") || "null"); } catch (_) { return null; } }
  function escapeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function openPanel() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    launch.classList.add("hidden");
    if (getLead()) { showChat(); }
    else { var f = gate.querySelector("input"); if (f) setTimeout(function () { f.focus(); }, 120); }
  }
  function closePanel() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    launch.classList.remove("hidden");
  }
  launch.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  window.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) closePanel(); });

  function gateErr(t) { gateMsg.textContent = t; gateMsg.className = "cbot-gate-msg err"; }
  leadForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = leadForm.name.value.trim(), email = leadForm.email.value.trim(),
        mobile = leadForm.mobile.value.trim(), country = leadForm.country.value.trim();
    if (name.length < 2) return gateErr("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return gateErr("Please enter a valid email address.");
    if (mobile.replace(/[^\d]/g, "").length < 6) return gateErr("Please enter your mobile number.");
    if (country.length < 2) return gateErr("Please enter your country.");
    var lead = { name: name, email: email, mobile: mobile, country: country };
    try { localStorage.setItem("pdna_chat_lead", JSON.stringify(lead)); } catch (_) {}
    // Capture the lead by email (non-blocking) — reuses the certify endpoint -> ramiblockchain2021
    try {
      fetch("/api/certify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name, email: email, phone: mobile, country: country,
          level: "Website chatbot enquiry", motivation: "Started a chat session via the website assistant."
        })
      }).catch(function () {});
    } catch (_) {}
    showChat();
  });

  var started = false;
  function showChat() {
    if (started) return; started = true;
    gate.hidden = true; chat.hidden = false;
    var lead = getLead();
    var first = lead && lead.name ? lead.name.split(" ")[0] : "there";
    botSay("Hi " + escapeHtml(first) + "! 👋 I'm <b>Windy</b>, your PlayerDNA AI guide. Ask me about how the system works, the tests, pricing, positions, or how to get certified.");
    renderQuick();
    setTimeout(function () { input.focus(); }, 100);
  }

  function addMsg(who, html) {
    var d = document.createElement("div");
    d.className = "cbot-msg " + who;
    d.innerHTML = html;
    messages.appendChild(d);
    messages.scrollTop = messages.scrollHeight;
    return d;
  }
  function botSay(html) { addMsg("bot", html); }
  function typing() {
    var d = document.createElement("div");
    d.className = "cbot-msg bot cbot-typing";
    d.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(d); messages.scrollTop = messages.scrollHeight;
    return d;
  }
  function renderQuick() {
    quick.innerHTML = "";
    QUICK.forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = q;
      b.addEventListener("click", function () { sendUser(q); });
      quick.appendChild(b);
    });
  }
  function answer(msg) {
    var m = " " + msg.toLowerCase() + " ", best = null, bestScore = 0;
    KB.forEach(function (it) {
      var s = 0; for (var i = 0; i < it.k.length; i++) { if (m.indexOf(it.k[i]) >= 0) s++; }
      if (s > bestScore) { bestScore = s; best = it; }
    });
    return bestScore > 0 && best ? best.a : FALLBACK;
  }
  function sendUser(text) {
    addMsg("user", escapeHtml(text));
    input.value = "";
    var t = typing();
    setTimeout(function () { t.remove(); botSay(answer(text)); }, 550 + Math.random() * 450);
  }
  inputForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value.trim(); if (v) sendUser(v);
  });
  // Links inside bot replies that open the demo modal: close the chat so the modal shows on top
  messages.addEventListener("click", function (e) {
    if (e.target.closest("[data-open-demo], [data-open-auth]")) closePanel();
  });
})();
