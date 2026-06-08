/* ============================================================
   PlayerDNA Labs — interactions & animations
   Defensive: every block checks for its elements first,
   so this single file works across every page.
   ============================================================ */

/* ---------- Intro AI-scan loader (runs first) ---------- */
(function () {
  const loader = document.getElementById("loader");
  if (!loader) { document.body.classList.add("is-loaded"); return; }
  const bar = document.getElementById("loaderBar");
  const pctEl = document.getElementById("loaderPct");
  const stepEl = document.getElementById("loaderStep");
  const steps = [
    "Detecting player…",
    "Tracking movement…",
    "Estimating body pose…",
    "Scoring athlete metrics…",
    "Computing best-fit position…",
    "Compiling intelligence report…"
  ];
  const framesEl = document.getElementById("loaderFrames");
  const FRAMES = 7420;
  const dcounts = Array.prototype.map.call(loader.querySelectorAll("[data-dcount]"), (el) => ({
    el: el,
    target: parseFloat(el.dataset.dcount),
    dec: (el.dataset.dcount.split(".")[1] || "").length,
    suffix: el.dataset.suffix || ""
  }));
  const setReadouts = (frac) => {
    dcounts.forEach((d) => { d.el.textContent = (d.target * frac).toFixed(d.dec) + d.suffix; });
    if (framesEl) framesEl.textContent = "FR " + String(Math.round(FRAMES * frac)).padStart(4, "0");
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    loader.classList.add("done");
    document.body.classList.remove("loading");
    document.body.classList.add("is-loaded");
    setTimeout(() => loader.remove(), 700);
  };

  if (reduce) {
    if (bar) bar.style.width = "100%";
    if (pctEl) pctEl.textContent = "100";
    if (stepEl) stepEl.textContent = "Ready";
    setReadouts(1);
    setTimeout(finish, 350);
    return;
  }

  document.body.classList.add("loading");
  if (stepEl) stepEl.textContent = steps[0];
  let si = 0;
  const stepTimer = setInterval(() => {
    si = Math.min(si + 1, steps.length - 1);
    if (stepEl) stepEl.textContent = steps[si];
  }, 360);

  const start = performance.now();
  const dur = 2400;
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 2);
    const pct = Math.round(eased * 100);
    if (bar) bar.style.width = pct + "%";
    if (pctEl) pctEl.textContent = pct;
    setReadouts(eased);
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      clearInterval(stepTimer);
      setReadouts(1);
      if (stepEl) stepEl.textContent = "Ready";
      setTimeout(finish, 320);
    }
  };
  requestAnimationFrame(tick);

  // Failsafe: never trap the page behind the loader
  setTimeout(() => {
    clearInterval(stepTimer);
    finish();
  }, 4500);
})();

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year stamp ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Sticky nav on scroll ---------- */
  const nav = $(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const toggle = $(".nav-toggle");
  const menu = $(".mobile-menu");
  if (toggle && menu) {
    const close = () => {
      toggle.classList.remove("open");
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", close));
    window.addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = $$(".reveal");
  if (reveals.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      reveals.forEach((el) => io.observe(el));
    }
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  if (counters.length) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const dur = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = (target * eased).toFixed(decimals);
        el.textContent = prefix + Number(val).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toLocaleString() + suffix;
      };
      requestAnimationFrame(tick);
    };
    if (prefersReduced || !("IntersectionObserver" in window)) {
      counters.forEach((el) => (el.textContent = (el.dataset.prefix || "") + el.dataset.count + (el.dataset.suffix || "")));
    } else {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(entry.target);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ---------- Hero scan bars fill when visible ---------- */
  const scanCard = $(".scan-card");
  if (scanCard) {
    const fill = () => $$(".bar-fill", scanCard).forEach((b) => (b.style.width = (b.dataset.val || 0) + "%"));
    if (prefersReduced) fill();
    else {
      const sio = new IntersectionObserver(
        (e) => e.forEach((en) => en.isIntersecting && (fill(), sio.disconnect())),
        { threshold: 0.4 }
      );
      sio.observe(scanCard);
    }
  }

  /* ---------- Generic progress bars [data-bar] ---------- */
  const bars = $$("[data-bar]");
  if (bars.length) {
    const fillBar = (el) => (el.style.width = el.dataset.bar + "%");
    if (prefersReduced || !("IntersectionObserver" in window)) bars.forEach(fillBar);
    else {
      const bio = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (en.isIntersecting) {
              fillBar(en.target);
              bio.unobserve(en.target);
            }
          }),
        { threshold: 0.4 }
      );
      bars.forEach((el) => bio.observe(el));
    }
  }

  /* ---------- Card spotlight follow ---------- */
  $$(".card.spot").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    $$("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  }

  /* ---------- Tabs ---------- */
  $$("[data-tabs]").forEach((group) => {
    const btns = $$(".tab-btn", group);
    const panels = $$(".tab-panel", group.parentElement || document);
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const id = btn.dataset.tab;
        panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === id));
      });
    });
  });

  /* ---------- Animated SVG radar charts ---------- */
  function buildRadar(svg) {
    const labels = (svg.dataset.labels || "").split("|").filter(Boolean);
    const values = (svg.dataset.values || "").split(",").map(Number).filter((n) => !isNaN(n));
    const n = Math.min(labels.length || values.length, values.length);
    if (!n) return;

    const size = 320;
    const cx = size / 2;
    const cy = size / 2;
    const R = size / 2 - 52;
    const rings = 4;
    const NS = "http://www.w3.org/2000/svg";
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.classList.add("radar-svg");

    const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
    const point = (i, r) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r];

    // rings
    for (let g = 1; g <= rings; g++) {
      const r = (R * g) / rings;
      const pts = [];
      for (let i = 0; i < n; i++) pts.push(point(i, r).join(","));
      const poly = document.createElementNS(NS, "polygon");
      poly.setAttribute("points", pts.join(" "));
      poly.setAttribute("class", "ring");
      svg.appendChild(poly);
    }
    // axes + labels
    for (let i = 0; i < n; i++) {
      const [x, y] = point(i, R);
      const axis = document.createElementNS(NS, "line");
      axis.setAttribute("x1", cx);
      axis.setAttribute("y1", cy);
      axis.setAttribute("x2", x);
      axis.setAttribute("y2", y);
      axis.setAttribute("class", "axis");
      svg.appendChild(axis);

      if (labels[i]) {
        const [lx, ly] = point(i, R + 22);
        const t = document.createElementNS(NS, "text");
        t.setAttribute("x", lx);
        t.setAttribute("y", ly);
        t.setAttribute("class", "label");
        t.setAttribute("text-anchor", Math.abs(lx - cx) < 6 ? "middle" : lx < cx ? "end" : "start");
        t.setAttribute("dominant-baseline", "middle");
        t.textContent = labels[i];
        svg.appendChild(t);
      }
    }
    // radar sweep (decorative; skipped under reduced motion)
    if (!prefersReduced) {
      const g = document.createElementNS(NS, "g");
      const sweepAngle = -Math.PI / 2;
      const spread = 0.34;
      const wx1 = cx + Math.cos(sweepAngle - spread) * R;
      const wy1 = cy + Math.sin(sweepAngle - spread) * R;
      const wx2 = cx + Math.cos(sweepAngle + spread) * R;
      const wy2 = cy + Math.sin(sweepAngle + spread) * R;
      const wedge = document.createElementNS(NS, "polygon");
      wedge.setAttribute("points", `${cx},${cy} ${wx1},${wy1} ${wx2},${wy2}`);
      wedge.setAttribute("class", "sweep-wedge");
      const line = document.createElementNS(NS, "line");
      line.setAttribute("x1", cx);
      line.setAttribute("y1", cy);
      line.setAttribute("x2", cx);
      line.setAttribute("y2", cy - R);
      line.setAttribute("class", "sweep");
      g.appendChild(wedge);
      g.appendChild(line);
      const at = document.createElementNS(NS, "animateTransform");
      at.setAttribute("attributeName", "transform");
      at.setAttribute("attributeType", "XML");
      at.setAttribute("type", "rotate");
      at.setAttribute("from", `0 ${cx} ${cy}`);
      at.setAttribute("to", `360 ${cx} ${cy}`);
      at.setAttribute("dur", "5.5s");
      at.setAttribute("repeatCount", "indefinite");
      g.appendChild(at);
      svg.appendChild(g);
    }

    // data polygon
    const dataPts = values.slice(0, n).map((v, i) => point(i, (R * Math.max(0, Math.min(100, v))) / 100));
    const poly = document.createElementNS(NS, "polygon");
    poly.setAttribute("class", "poly");
    poly.setAttribute("points", dataPts.map((p) => p.join(",")).join(" "));
    svg.appendChild(poly);
    dataPts.forEach((p) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", p[0]);
      c.setAttribute("cy", p[1]);
      c.setAttribute("r", 3.5);
      c.setAttribute("class", "pt");
      svg.appendChild(c);
    });

    // entrance animation: scale from center
    if (!prefersReduced) {
      poly.style.transformOrigin = "center";
      poly.style.transform = "scale(0.05)";
      poly.style.opacity = "0";
      poly.style.transition = "transform 1.1s cubic-bezier(.22,1,.36,1), opacity .6s";
      const rio = new IntersectionObserver(
        (e) =>
          e.forEach((en) => {
            if (en.isIntersecting) {
              poly.style.transform = "scale(1)";
              poly.style.opacity = "1";
              rio.disconnect();
            }
          }),
        { threshold: 0.4 }
      );
      rio.observe(svg);
    }
  }
  $$(".radar-svg[data-values]").forEach(buildRadar);

  /* ---------- Print / download report (Save as PDF) ---------- */
  $$("[data-print]").forEach((btn) => btn.addEventListener("click", () => window.print()));

  /* ---------- Book-a-Demo modal (front-end only; backend connects later) ---------- */
  const demoModal = $("#demoModal");
  if (demoModal) {
    const openDemo = () => {
      demoModal.classList.add("open");
      document.body.classList.add("modal-open");
      demoModal.setAttribute("aria-hidden", "false");
      const first = demoModal.querySelector("input");
      if (first) setTimeout(() => first.focus(), 80);
    };
    const closeDemo = () => {
      demoModal.classList.remove("open");
      document.body.classList.remove("modal-open");
      demoModal.setAttribute("aria-hidden", "true");
    };
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open-demo]");
      if (btn) { e.preventDefault(); openDemo(); }
    });
    $$("[data-close-demo]", demoModal).forEach((el) => el.addEventListener("click", closeDemo));
    demoModal.addEventListener("click", (e) => {
      if (e.target === demoModal || e.target.classList.contains("modal-overlay")) closeDemo();
    });
    window.addEventListener("keydown", (e) => e.key === "Escape" && demoModal.classList.contains("open") && closeDemo());
    if (location.hash === "#demo") openDemo();

    const demoForm = $("#demoForm");
    const demoMsg = $("#demoFormMsg");
    const setDemoMsg = (type, text) => {
      if (!demoMsg) return;
      demoMsg.className = "form-msg show " + type;
      demoMsg.textContent = text;
    };
    if (demoForm) {
      demoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = demoForm.querySelector('input[name="name"]');
        const email = demoForm.querySelector('input[type="email"]');
        const validName = name && name.value.trim().length >= 2;
        const validEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
        if (!validName) return setDemoMsg("err", "Please enter your name so we know who to reach.");
        if (!validEmail) return setDemoMsg("err", "Please enter a valid work email address.");
        const btn = $("#demoSubmit");
        const original = btn ? btn.textContent : "";
        if (btn) { btn.textContent = "Sending…"; btn.disabled = true; }
        setTimeout(() => {
          setDemoMsg(
            "ok",
            "Thanks, " + name.value.trim().split(" ")[0] + "! Your demo request is ready. Connect a CRM/email backend to this form to receive it and schedule your 10-minute walkthrough."
          );
          if (btn) { btn.textContent = "Request sent ✓"; }
          const fields = demoForm.querySelectorAll("input, select, textarea");
          fields.forEach((f) => (f.disabled = true));
          setTimeout(() => {
            if (btn) { btn.textContent = original; btn.disabled = false; }
            fields.forEach((f) => (f.disabled = false));
            demoForm.reset();
          }, 4200);
        }, 1100);
      });
    }
  }

  /* ---------- Standards marquee (duplicate track for a seamless loop) ---------- */
  const stdTrack = $("[data-marquee] .std-mq-track");
  if (stdTrack && !prefersReduced) {
    Array.from(stdTrack.children).forEach((chip) => {
      const clone = chip.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      stdTrack.appendChild(clone);
    });
  }

  /* ---------- Immersive Playbook (open-book, 2-page spread) ---------- */
  const bookModal = $("#bookModal");
  if (bookModal) {
    const PAGES = $$("#bkTemplates .bk-tpl").map((t) => t.innerHTML);
    const TOTAL = PAGES.length;
    const SPREADS = Math.ceil(TOTAL / 2);
    const bkLeft = $("#bkLeft"), bkRight = $("#bkRight");
    const leaf = $("#bkLeaf"), leafFront = $("#bkLeafFront"), leafBack = $("#bkLeafBack");
    const obook = $("#obook");
    const curEl = $("#fbCur"), totEl = $("#fbTot");
    const prevBtn = $(".fb-prev", bookModal), nextBtn = $(".fb-next", bookModal);
    let page = 0, animating = false, gen = 0, perView = 2;
    const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
    const recomputePerView = () => { perView = isMobile() ? 1 : 2; if (perView === 2) page = Math.floor(page / 2) * 2; };
    const views = () => (perView === 2 ? Math.ceil(TOTAL / 2) : TOTAL);
    recomputePerView();

    const pg = (i) => (i >= 0 && i < TOTAL ? PAGES[i] : "");
    const paint = (el, i) => { el.innerHTML = pg(i); el.classList.toggle("is-blank", pg(i) === ""); };
    let videoRAF = null, activeVid = null;
    const stopVideo = () => {
      if (videoRAF) { cancelAnimationFrame(videoRAF); videoRAF = null; }
      if (activeVid) { try { activeVid.pause(); } catch (_) {} activeVid = null; }
    };
    const mountVideo = () => {
      stopVideo();
      const wrap = bkLeft.querySelector(".fb-video-wrap") || bkRight.querySelector(".fb-video-wrap");
      if (!wrap) return;
      const v = wrap.querySelector(".fb-video-src"), c = wrap.querySelector(".fb-video-canvas");
      if (!v || !c) return;
      if (!v.getAttribute("src") && v.dataset.src) v.setAttribute("src", v.dataset.src);
      v.muted = true; v.loop = true; v.playsInline = true;
      activeVid = v;
      const ctx = c.getContext("2d");
      const draw = () => {
        const w = c.clientWidth, h = c.clientHeight;
        if (w && h) {
          if (c.width !== w) c.width = w;
          if (c.height !== h) c.height = h;
          if (v.readyState >= 2 && v.videoWidth) {
            const vr = v.videoWidth / v.videoHeight, cr = w / h;
            let dw, dh; if (vr > cr) { dh = h; dw = h * vr; } else { dw = w; dh = w / vr; }
            try { ctx.drawImage(v, (w - dw) / 2, (h - dh) / 2, dw, dh); } catch (_) {}
          }
        }
        videoRAF = requestAnimationFrame(draw);
      };
      v.play().catch(() => {});
      draw();
    };
    const renderStatic = () => {
      if (obook) obook.classList.toggle("is-single", perView === 1);
      if (perView === 2) {
        paint(bkLeft, page);
        paint(bkRight, page + 1);
      } else {
        bkLeft.innerHTML = ""; bkLeft.classList.add("is-blank");
        paint(bkRight, page);
      }
      const vi = perView === 2 ? Math.floor(page / 2) : page;
      if (curEl) curEl.textContent = vi + 1;
      if (totEl) totEl.textContent = views();
      if (prevBtn) prevBtn.disabled = page <= 0;
      if (nextBtn) nextBtn.disabled = page + perView >= TOTAL;
      mountVideo();
    };

    let muted = false;
    try { muted = localStorage.getItem("pdna_book_sound") === "off"; } catch (_) {}
    let audioCtx;
    const playFlip = () => {
      if (muted) return;
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();
        const ctx = audioCtx, dur = 0.32, t0 = ctx.currentTime;
        const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        const src = ctx.createBufferSource(); src.buffer = buf;
        const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 0.7;
        bp.frequency.setValueAtTime(640, t0); bp.frequency.exponentialRampToValueAtTime(2900, t0 + dur);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(0.075, t0 + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0006, t0 + dur);
        src.connect(bp); bp.connect(g); g.connect(ctx.destination);
        src.start(t0); src.stop(t0 + dur);
      } catch (_) {}
    };

    const setupLeaf = (dir) => {
      if (perView === 2) {
        if (dir > 0) {
          paint(leafFront, page + 1);          // current right page turns left
          paint(leafBack, page + 2);           // next left on its back
          paint(bkRight, page + 3);            // new right beneath
          leaf.className = "obook-leaf is-next";
        } else {
          paint(leafFront, page);              // current left page turns right
          paint(leafBack, page - 1);           // prev right on its back
          paint(bkLeft, page - 2);             // new left beneath
          leaf.className = "obook-leaf is-prev";
        }
      } else {
        paint(leafFront, page);                // current single page is the leaf
        paint(leafBack, dir > 0 ? page + 1 : page - 1);
        paint(bkRight, dir > 0 ? page + 1 : page - 1);   // target revealed beneath
        leaf.className = "obook-leaf is-single " + (dir > 0 ? "is-next" : "is-prev");
      }
    };
    const flip = (dir) => {
      if (animating) return;
      if (dir > 0 && page + perView >= TOTAL) return;
      if (dir < 0 && page <= 0) return;
      animating = true;
      setupLeaf(dir);
      void leaf.offsetWidth;
      leaf.classList.add("flipping");
      playFlip();
      const myGen = ++gen;
      const done = () => {
        if (myGen !== gen || !animating) return;
        page += dir * perView;
        renderStatic();
        leaf.className = "obook-leaf";
        animating = false;
      };
      leaf.addEventListener("transitionend", done, { once: true });
      setTimeout(done, 1100); // fallback if transitionend doesn't fire
    };

    const openBook = () => {
      bookModal.classList.add("open");
      document.body.classList.add("modal-open");
      bookModal.setAttribute("aria-hidden", "false");
      recomputePerView();
      gen++; page = 0; animating = false;
      leaf.className = "obook-leaf"; leaf.style.transition = ""; leaf.style.transform = "";
      renderStatic();
    };
    const closeBook = () => {
      stopVideo();
      bookModal.classList.remove("open");
      document.body.classList.remove("modal-open");
      bookModal.setAttribute("aria-hidden", "true");
    };

    $$("[data-open-book]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openBook(); }));
    $$("[data-close-book]", bookModal).forEach((b) => b.addEventListener("click", closeBook));
    if (prevBtn) prevBtn.addEventListener("click", () => flip(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => flip(1));
    bookModal.addEventListener("click", (e) => {
      if (e.target === bookModal) { closeBook(); return; }
      const mb = e.target.closest(".fb-video-mute");
      if (mb && activeVid) {
        activeVid.muted = !activeVid.muted;
        mb.classList.toggle("muted", activeVid.muted);
        if (!activeVid.muted) activeVid.play().catch(() => {});
        return;
      }
      // injected CTA buttons: close the book so the demo modal (delegated on document) shows on top
      if (e.target.closest("[data-open-demo]")) closeBook();
    });
    // Click the left / right half of the spread to turn pages (suppressed right after a drag)
    let suppressClick = false;
    if (obook) obook.addEventListener("click", (e) => {
      if (suppressClick) { suppressClick = false; return; }
      if (e.target.closest("a, button, .fb-video-wrap")) return;
      const r = obook.getBoundingClientRect();
      if (e.clientX > r.left + r.width / 2) flip(1); else flip(-1);
    });
    // Drag-to-turn: grab a page edge and pull
    let drag = null;
    if (obook) {
      obook.addEventListener("pointerdown", (e) => {
        if (animating) return;
        if (e.target.closest("a, button, .fb-video-wrap")) return;
        const r = obook.getBoundingClientRect();
        const x = e.clientX - r.left, edge = r.width * 0.45;
        let dir = 0;
        if (x > r.width - edge) dir = 1; else if (x < edge) dir = -1; else return;
        if ((dir > 0 && page + perView >= TOTAL) || (dir < 0 && page <= 0)) return;
        drag = { dir: dir, startX: e.clientX, w: r.width * (perView === 2 ? 0.5 : 1), progress: 0, started: false, pid: e.pointerId };
      });
      obook.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.startX;
        if (!drag.started) {
          if (Math.abs(dx) < 6) return;
          drag.started = true;
          setupLeaf(drag.dir);
          leaf.style.transition = "none";
          try { obook.setPointerCapture(drag.pid); } catch (_) {}
        }
        let p = (drag.dir > 0 ? -dx : dx) / drag.w;
        p = Math.max(0, Math.min(1, p));
        drag.progress = p;
        leaf.style.transform = "rotateY(" + ((drag.dir > 0 ? -1 : 1) * 180 * p) + "deg)";
      });
      const endDrag = () => {
        if (!drag) return;
        const d = drag; drag = null;
        if (!d.started) return;
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 350);
        const complete = d.progress > 0.35;
        animating = true;
        leaf.style.transition = "transform 0.5s cubic-bezier(0.4,0.05,0.25,1)";
        void leaf.offsetWidth;
        leaf.style.transform = "rotateY(" + (complete ? (d.dir > 0 ? -1 : 1) * 180 : 0) + "deg)";
        if (complete) playFlip();
        const myGen = ++gen;
        const finish = () => {
          if (myGen !== gen) return;
          if (complete) page += d.dir * perView;
          leaf.style.transition = ""; leaf.style.transform = ""; leaf.className = "obook-leaf";
          renderStatic();
          animating = false;
        };
        leaf.addEventListener("transitionend", finish, { once: true });
        setTimeout(finish, 700);
      };
      obook.addEventListener("pointerup", endDrag);
      obook.addEventListener("pointercancel", endDrag);
    }
    // Re-layout when crossing the mobile breakpoint (single <-> spread)
    let bkResizeT;
    window.addEventListener("resize", () => {
      const prev = perView;
      recomputePerView();
      if (perView !== prev && bookModal.classList.contains("open")) {
        clearTimeout(bkResizeT);
        bkResizeT = setTimeout(() => {
          animating = false; leaf.className = "obook-leaf"; leaf.style.transition = ""; leaf.style.transform = "";
          renderStatic();
        }, 150);
      }
    });
    window.addEventListener("keydown", (e) => {
      if (!bookModal.classList.contains("open")) return;
      if (e.key === "Escape") closeBook();
      else if (e.key === "ArrowRight") flip(1);
      else if (e.key === "ArrowLeft") flip(-1);
    });
    const soundBtn = $("[data-book-sound]");
    if (soundBtn) {
      if (muted) soundBtn.classList.add("muted");
      soundBtn.setAttribute("aria-pressed", String(!muted));
      soundBtn.addEventListener("click", () => {
        muted = !muted;
        soundBtn.classList.toggle("muted", muted);
        soundBtn.setAttribute("aria-pressed", String(!muted));
        try { localStorage.setItem("pdna_book_sound", muted ? "off" : "on"); } catch (_) {}
        if (!muted) playFlip();
      });
    }
    renderStatic();
  }

  /* ---------- Capability flip cards (tap / keyboard) ---------- */
  $$(".flip-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.classList.toggle("flipped"); }
    });
  });

  /* ---------- Section dot navigator (right edge) ---------- */
  const dotDefs = [
    ["modes", "Modes"],
    ["capabilities", "Capabilities"],
    ["how", "How it works"],
    ["positions", "Positions"],
    ["modules", "Modules"],
    ["dashboard", "Dashboard"],
    ["technology", "Technology"],
    ["pricing", "Pricing"],
    ["safety", "Safety"]
  ].filter(([id]) => document.getElementById(id));
  if (dotDefs.length) {
    const dotsNav = document.createElement("nav");
    dotsNav.className = "section-dots";
    dotsNav.setAttribute("aria-label", "Section navigation");
    dotDefs.forEach(([id, label]) => {
      const a = document.createElement("a");
      a.href = "#" + id;
      a.dataset.label = label;
      a.setAttribute("aria-label", label);
      dotsNav.appendChild(a);
    });
    document.body.appendChild(dotsNav);
  }

  /* ---------- Scrollspy: highlight nav links + section dots in view ---------- */
  const spyLinks = $$('.nav-links a[href^="#"], .section-dots a[href^="#"]');
  if (spyLinks.length && "IntersectionObserver" in window) {
    const byId = new Map();
    spyLinks.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      if (!byId.has(id)) byId.set(id, []);
      byId.get(id).push(a);
    });
    const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            spyLinks.forEach((a) => a.classList.remove("active"));
            (byId.get(en.target.id) || []).forEach((a) => a.classList.add("active"));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Photography: fade in on load, graceful fallback on error ---------- */
  const PHOTO_FALLBACK =
    "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'16'%20height%3D'10'%2F%3E";
  $$("img[data-photo]").forEach((img) => {
    const onLoad = () => img.classList.add("loaded");
    const onError = () => {
      img.classList.add("failed");
      if (img.getAttribute("src") !== PHOTO_FALLBACK) img.src = PHOTO_FALLBACK;
    };
    if (img.complete) {
      img.naturalWidth > 0 ? onLoad() : onError();
    } else {
      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onError, { once: true });
    }
  });

  /* ---------- Hero cursor-follow glow + parallax depth ---------- */
  const heroEl = $(".hero");
  if (heroEl && !prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    const heroMedia = $(".hero-media", heroEl);
    heroEl.addEventListener("pointermove", (e) => {
      const r = heroEl.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      heroEl.style.setProperty("--gx", `${((nx + 0.5) * 100).toFixed(1)}%`);
      heroEl.style.setProperty("--gy", `${((ny + 0.5) * 100).toFixed(1)}%`);
      heroEl.classList.add("glow-active");
      if (heroMedia) {
        heroMedia.style.transform = `perspective(1100px) rotateY(${(nx * 7).toFixed(2)}deg) rotateX(${(-ny * 7).toFixed(2)}deg)`;
      }
    });
    heroEl.addEventListener("pointerleave", () => {
      heroEl.classList.remove("glow-active");
      if (heroMedia) heroMedia.style.transform = "";
    });
  }

  /* ---------- Scroll progress bar ---------- */
  const prog = $(".scroll-progress");
  if (prog) {
    let pTick = false;
    const updProg = () => {
      if (pTick) return;
      pTick = true;
      requestAnimationFrame(() => {
        const d = document.documentElement;
        const max = d.scrollHeight - d.clientHeight;
        prog.style.transform = `scaleX(${max > 0 ? Math.min(1, (window.scrollY || d.scrollTop) / max) : 0})`;
        pTick = false;
      });
    };
    updProg();
    window.addEventListener("scroll", updProg, { passive: true });
    window.addEventListener("resize", updProg);
  }

  /* ---------- Live "re-scanning" hero card ---------- */
  if (scanCard && !prefersReduced) {
    const liveBars = $$(".bar-fill", scanCard);
    const pctEl = $(".scan-foot .pct", scanCard);
    const bases = liveBars.map((b) => parseFloat(b.dataset.val) || 70);
    const basePct = pctEl ? parseInt(pctEl.textContent, 10) || 91 : 91;
    let t = 0;
    const jitter = () => {
      t++;
      liveBars.forEach((b, i) => {
        const v = bases[i] + Math.round(Math.sin(t * 0.6 + i * 1.3) * 2);
        b.style.width = Math.max(8, Math.min(99, v)) + "%";
      });
      if (pctEl) {
        const p = basePct + Math.round(Math.sin(t * 0.5) * 1);
        pctEl.textContent = Math.max(80, Math.min(99, p)) + "%";
      }
    };
    let iv = setInterval(jitter, 4000);
    document.addEventListener("visibilitychange", () => {
      clearInterval(iv);
      if (!document.hidden) iv = setInterval(jitter, 4000);
    });
  }

  /* ---------- 3D pose-tracking skeleton (hero centerpiece) ---------- */
  const poseCanvas = document.getElementById("poseCanvas");
  if (poseCanvas && poseCanvas.getContext) {
    const pctx = poseCanvas.getContext("2d");
    const PDPR = Math.min(window.devicePixelRatio || 1, 2);
    let PW = 0, PH = 0, praf = 0, pt = 0, prun = true;
    const BASE = [
      [0, 96, 0], [0, 82, 0], [0, 64, 0], [0, 48, 0],
      [-16, 80, 0], [-25, 64, 0], [-28, 49, 0],
      [16, 80, 0], [25, 64, 0], [28, 49, 0],
      [-8, 48, 0], [-10, 25, 0], [-11, 3, 0],
      [8, 48, 0], [10, 25, 0], [11, 3, 0]
    ];
    const BONES = [[0,1],[1,2],[2,3],[1,4],[4,5],[5,6],[1,7],[7,8],[8,9],[3,10],[10,11],[11,12],[3,13],[13,14],[14,15]];

    // ---- Football movement poses (each returns 16 joints [x,y,z]) ----
    const clone = () => BASE.map((b) => [b[0], b[1], b[2]]);
    const shiftY = (p, dy) => { for (let i = 0; i < p.length; i++) p[i][1] += dy; };
    const sprintPose = (tt) => {
      const ph = tt * 4.4, p = clone(), sw = 27;
      [0, 1, 2, 4, 5, 6, 7, 8, 9].forEach((i) => { p[i][2] += 7; });
      p[11][2] = Math.sin(ph) * sw * 0.6; p[12][2] = Math.sin(ph) * sw;
      p[14][2] = Math.sin(ph + Math.PI) * sw * 0.6; p[15][2] = Math.sin(ph + Math.PI) * sw;
      p[11][1] = 25 + Math.max(0, Math.sin(ph)) * 9; p[12][1] = 3 + Math.max(0, Math.sin(ph)) * 14;
      p[14][1] = 25 + Math.max(0, Math.sin(ph + Math.PI)) * 9; p[15][1] = 3 + Math.max(0, Math.sin(ph + Math.PI)) * 14;
      p[5][2] = Math.sin(ph + Math.PI) * sw * 0.5; p[6][2] = Math.sin(ph + Math.PI) * sw * 0.95;
      p[8][2] = Math.sin(ph) * sw * 0.5; p[9][2] = Math.sin(ph) * sw * 0.95;
      shiftY(p, Math.abs(Math.sin(ph)) * 4);
      return p;
    };
    const kickPose = (tt) => {
      const p = clone(), k = (Math.sin(tt * 2.3) + 1) / 2;
      p[11][2] = 4; p[12][2] = 2;
      p[14][2] = -8 + k * 42; p[14][1] = 25 + k * 12;
      p[15][2] = -18 + k * 78; p[15][1] = 3 + k * 42;
      p[5][2] = 16; p[6][2] = 24; p[6][1] = 50;
      p[8][2] = -14; p[9][2] = -20; p[9][1] = 50;
      [0, 1, 2].forEach((i) => { p[i][2] -= k * 8; });
      return p;
    };
    const jumpPose = (tt) => {
      const p = clone(), j = (Math.sin(tt * 2.0 - Math.PI / 2) + 1) / 2, cr = 1 - j;
      p[11][2] = cr * 14; p[14][2] = cr * 14;
      p[11][1] = 25 - cr * 3; p[14][1] = 25 - cr * 3;
      p[5][1] = 64 + j * 20; p[6][1] = 49 + j * 36; p[6][0] = -28 + j * 9;
      p[8][1] = 64 + j * 20; p[9][1] = 49 + j * 36; p[9][0] = 28 - j * 9;
      shiftY(p, j * 15 - cr * 5);
      return p;
    };
    const MOVES = [sprintPose, kickPose, jumpPose];
    const ACTIONS = ["SPRINT", "STRIKE", "LEAP"];
    const MOVE_DUR = 4.6, TRANS = 0.9;
    const lerpPose = (a, b, f) => a.map((j, i) => [j[0] + (b[i][0] - j[0]) * f, j[1] + (b[i][1] - j[1]) * f, j[2] + (b[i][2] - j[2]) * f]);
    const CALLOUTS = [
      { j: 12, label: "SPEED", val: "88", side: "L", zone: "lower" },
      { j: 4, label: "STAMINA", val: "74", side: "L", zone: "upper" },
      { j: 14, label: "POWER", val: "79", side: "R", zone: "lower" },
      { j: 8, label: "AGILITY", val: "82", side: "R", zone: "upper" }
    ];
    const actionEl = document.getElementById("poseAction");
    let lastAction = -1;
    // ball position per move (sprint: dribble at feet, strike: at kicking foot, leap: header above head)
    const ballFor = (mi, tt, pose) => {
      if (mi === 0) { const ph = tt * 4.4; return [Math.sin(ph) * 6, 5 + Math.abs(Math.sin(ph * 2)) * 5, 34]; }
      if (mi === 1) { const f = pose[15]; return [f[0] * 0.6, Math.max(4, f[1] - 4), f[2] + 20]; }
      const h = pose[0]; return [h[0], h[1] + 7, 8];
    };
    const lerp3 = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];

    const psize = () => {
      PW = poseCanvas.clientWidth; PH = poseCanvas.clientHeight;
      poseCanvas.width = Math.round(PW * PDPR); poseCanvas.height = Math.round(PH * PDPR);
      pctx.setTransform(PDPR, 0, 0, PDPR, 0, 0);
    };

    const render = () => {
      pctx.clearRect(0, 0, PW, PH);
      if (PW <= 0 || PH <= 0) return;
      const tsec = pt / 60;
      // football move sequence with cross-fade
      const cyc = tsec / MOVE_DUR;
      const idx = Math.floor(cyc) % MOVES.length;
      const nxt = (idx + 1) % MOVES.length;
      const f = cyc - Math.floor(cyc);
      const tEnter = TRANS / MOVE_DUR;
      let blend = f > 1 - tEnter ? (f - (1 - tEnter)) / tEnter : 0;
      blend = blend * blend * (3 - 2 * blend);
      const poseA = MOVES[idx](tsec);
      const p = blend > 0 ? lerpPose(poseA, MOVES[nxt](tsec), blend) : poseA;
      if (actionEl && idx !== lastAction) { actionEl.textContent = ACTIONS[idx]; lastAction = idx; }

      const rotY = Math.sin(tsec * 0.3) * 0.55;
      const cosR = Math.cos(rotY), sinR = Math.sin(rotY);
      const cx = PW / 2, scale = PH / 150, focal = 240, groundY = PH * 0.85;
      const proj = p.map(([x, y, z]) => {
        const rx = x * cosR + z * sinR;
        const rz = -x * sinR + z * cosR;
        const s = focal / (focal + rz);
        return { x: cx + rx * scale * s, y: groundY - y * scale, s: s, z: rz };
      });
      // ground shadow
      pctx.save();
      pctx.beginPath();
      pctx.ellipse(cx, groundY + 3, 28 * scale, 6 * scale, 0, 0, Math.PI * 2);
      pctx.fillStyle = "rgba(0,0,0,0.4)";
      pctx.filter = "blur(5px)";
      pctx.fill();
      pctx.restore();
      // bones
      BONES.forEach(([a, b]) => {
        const pa = proj[a], pb = proj[b];
        const dz = (pa.z + pb.z) / 2;
        const al = Math.max(0.24, Math.min(0.95, 0.62 - dz / 95));
        pctx.strokeStyle = "rgba(34,211,238," + al + ")";
        pctx.lineWidth = Math.max(1.6, 2.7 * ((pa.s + pb.s) / 2));
        pctx.lineCap = "round";
        pctx.beginPath(); pctx.moveTo(pa.x, pa.y); pctx.lineTo(pb.x, pb.y); pctx.stroke();
      });
      // joints (skip head joint — drawn as a head below)
      proj.forEach((q, i) => {
        if (i === 0) return;
        pctx.beginPath();
        pctx.arc(q.x, q.y, Math.max(2, 3.4 * q.s), 0, Math.PI * 2);
        pctx.fillStyle = "rgba(150,210,255,0.96)";
        pctx.shadowColor = "rgba(46,160,255,0.9)";
        pctx.shadowBlur = 12 * q.s;
        pctx.fill();
        pctx.shadowBlur = 0;
      });
      // head
      const hd = proj[0];
      const hrx = 6 * scale * hd.s, hry = 7.4 * scale * hd.s;
      pctx.save();
      pctx.beginPath();
      pctx.ellipse(hd.x, hd.y, hrx, hry, 0, 0, Math.PI * 2);
      pctx.fillStyle = "rgba(34,211,238,0.14)";
      pctx.shadowColor = "rgba(46,160,255,0.85)";
      pctx.shadowBlur = 16 * hd.s;
      pctx.fill();
      pctx.shadowBlur = 0;
      pctx.lineWidth = Math.max(1.6, 2.4 * hd.s);
      pctx.strokeStyle = "rgba(150,210,255,0.92)";
      pctx.stroke();
      pctx.restore();
      // football moving with the skeleton
      const ballPos = blend > 0 ? lerp3(ballFor(idx, tsec, p), ballFor(nxt, tsec, p), blend) : ballFor(idx, tsec, p);
      const brx = ballPos[0] * cosR + ballPos[2] * sinR;
      const brz = -ballPos[0] * sinR + ballPos[2] * cosR;
      const bs = focal / (focal + brz);
      const bx = cx + brx * scale * bs, by = groundY - ballPos[1] * scale, br = 5.2 * scale * bs;
      pctx.save();
      pctx.beginPath();
      pctx.ellipse(bx, groundY + 2, br * 0.9, br * 0.3, 0, 0, Math.PI * 2);
      pctx.fillStyle = "rgba(0,0,0,0.3)"; pctx.filter = "blur(3px)"; pctx.fill();
      pctx.restore();
      const bgrad = pctx.createRadialGradient(bx - br * 0.35, by - br * 0.4, br * 0.15, bx, by, br);
      bgrad.addColorStop(0, "#ffffff");
      bgrad.addColorStop(0.72, "#e9eff5");
      bgrad.addColorStop(1, "#b3c2cf");
      pctx.save();
      pctx.beginPath(); pctx.arc(bx, by, br, 0, Math.PI * 2);
      pctx.shadowColor = "rgba(0,0,0,0.45)"; pctx.shadowBlur = 7 * bs;
      pctx.fillStyle = bgrad; pctx.fill();
      pctx.shadowBlur = 0;
      pctx.clip();
      const pent = (pcx, pcy, rad, rot) => {
        pctx.beginPath();
        for (let k = 0; k < 5; k++) {
          const a = rot - Math.PI / 2 + k * 2 * Math.PI / 5;
          const px = pcx + Math.cos(a) * rad, py = pcy + Math.sin(a) * rad;
          if (k) pctx.lineTo(px, py); else pctx.moveTo(px, py);
        }
        pctx.closePath(); pctx.fill();
      };
      pctx.fillStyle = "#141b22";
      const penR = br * 0.4;
      pent(bx, by, penR, 0);
      pctx.strokeStyle = "rgba(20,28,36,0.6)";
      pctx.lineWidth = Math.max(1, br * 0.07);
      for (let k = 0; k < 5; k++) {
        const a = -Math.PI / 2 + k * 2 * Math.PI / 5;
        pctx.beginPath();
        pctx.moveTo(bx + Math.cos(a) * penR, by + Math.sin(a) * penR);
        pctx.lineTo(bx + Math.cos(a) * br * 1.1, by + Math.sin(a) * br * 1.1);
        pctx.stroke();
        const a2 = a + Math.PI / 5;
        pctx.fillStyle = "#141b22";
        pent(bx + Math.cos(a2) * br * 0.95, by + Math.sin(a2) * br * 0.95, br * 0.3, a2 + Math.PI);
      }
      pctx.restore();
      pctx.beginPath(); pctx.arc(bx, by, br, 0, Math.PI * 2);
      pctx.lineWidth = 1; pctx.strokeStyle = "rgba(34,211,238,0.3)"; pctx.stroke();
      // live score callouts on the body
      CALLOUTS.forEach((c) => {
        const q = proj[c.j];
        const sideX = c.side === "L" ? 14 : PW - 14;
        const zMin = c.zone === "upper" ? PH * 0.13 : PH * 0.56;
        const zMax = c.zone === "upper" ? PH * 0.40 : PH * 0.83;
        const ly = Math.max(zMin, Math.min(zMax, q.y));
        const near = c.side === "L" ? 60 : PW - 60;
        pctx.strokeStyle = "rgba(34,211,238,0.4)";
        pctx.lineWidth = 1;
        pctx.beginPath(); pctx.moveTo(q.x, q.y); pctx.lineTo(near, ly); pctx.stroke();
        pctx.fillStyle = "rgba(34,211,238,0.95)";
        pctx.beginPath(); pctx.arc(q.x, q.y, 2.4, 0, Math.PI * 2); pctx.fill();
        pctx.textAlign = c.side === "L" ? "left" : "right";
        pctx.textBaseline = "alphabetic";
        pctx.font = '700 14px "JetBrains Mono", ui-monospace, monospace';
        pctx.fillStyle = "rgba(150,210,255,0.98)";
        pctx.fillText(c.val, sideX, ly - 1);
        pctx.font = '600 8px "JetBrains Mono", ui-monospace, monospace';
        pctx.fillStyle = "rgba(150,170,190,0.85)";
        pctx.fillText(c.label, sideX, ly + 9);
      });
      pctx.textAlign = "left";
    };

    const ploop = () => {
      if (!prun) return;
      pt += 1;
      render();
      praf = requestAnimationFrame(ploop);
    };

    psize();
    if (prefersReduced) {
      pt = 8;
      render();
    } else {
      ploop();
      let prz;
      window.addEventListener("resize", () => { clearTimeout(prz); prz = setTimeout(psize, 150); }, { passive: true });
      document.addEventListener("visibilitychange", () => {
        prun = !document.hidden;
        if (prun) praf = requestAnimationFrame(ploop); else cancelAnimationFrame(praf);
      });
    }
  }

  /* ---------- Neural-network backdrop (AI signature) ---------- */
  const netCanvas = document.getElementById("neuralNet");
  if (netCanvas && !prefersReduced && netCanvas.getContext) {
    const ctx = netCanvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const rand = (a, b) => a + Math.random() * (b - a);
    const LINK = 118;
    let W = 0, H = 0, nodes = [], signals = [], raf = 0, running = true;

    const build = () => {
      W = netCanvas.clientWidth;
      H = netCanvas.clientHeight;
      netCanvas.width = Math.round(W * DPR);
      netCanvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.max(16, Math.min(42, Math.round((W * H) / 42000)));
      nodes = [];
      for (let i = 0; i < count; i++) nodes.push({ x: rand(0, W), y: rand(0, H), vx: rand(-0.11, 0.11), vy: rand(-0.11, 0.11) });
      signals = [];
    };

    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = "rgba(34,211,238," + (1 - d / LINK) * 0.22 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(150,205,255,0.7)"; ctx.fill();
      }
      if (signals.length < 4 && Math.random() < 0.05) {
        const i = (Math.random() * nodes.length) | 0, a = nodes[i];
        let best = -1, bestD = LINK;
        for (let j = 0; j < nodes.length; j++) {
          if (j === i) continue;
          const d = Math.hypot(a.x - nodes[j].x, a.y - nodes[j].y);
          if (d < bestD) { bestD = d; best = j; }
        }
        if (best >= 0) signals.push({ a: i, b: best, t: 0, sp: rand(0.012, 0.03) });
      }
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s], a = nodes[sig.a], b = nodes[sig.b];
        sig.t += sig.sp;
        if (sig.t >= 1) { signals.splice(s, 1); continue; }
        const x = a.x + (b.x - a.x) * sig.t, y = a.y + (b.y - a.y) * sig.t;
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(150,205,255,0.95)";
        ctx.shadowColor = "rgba(34,211,238,0.9)"; ctx.shadowBlur = 10;
        ctx.fill(); ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(frame);
    };

    let rz;
    window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(build, 200); }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    });
    build();
    frame();
  }

  /* ---------- Sample report modal (full athlete details) ---------- */
  const reportModal = document.getElementById("reportModal");
  if (reportModal) {
    const countUp = (el) => {
      const target = parseFloat(el.dataset.count) || 0;
      const dec = (String(el.dataset.count).split(".")[1] || "").length;
      const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      const start = performance.now(), dur = 850;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + (target * e).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = pre + target.toFixed(dec) + suf;
      };
      requestAnimationFrame(tick);
    };
    const activateReport = () => {
      const revs = reportModal.querySelectorAll(".reveal");
      const bars = reportModal.querySelectorAll("[data-bar]");
      const polys = reportModal.querySelectorAll(".radar-svg .poly");
      const counts = reportModal.querySelectorAll("[data-count]");
      if (prefersReduced) {
        revs.forEach((r) => r.classList.add("is-visible"));
        bars.forEach((el) => { el.style.width = el.dataset.bar + "%"; });
        polys.forEach((p) => { p.style.transform = "scale(1)"; p.style.opacity = "1"; });
        counts.forEach((el) => { el.textContent = (el.dataset.prefix || "") + (parseFloat(el.dataset.count) || 0) + (el.dataset.suffix || ""); });
        return;
      }
      // "report generating" sequence — panels cascade, bars fill, radar draws, numbers count up
      revs.forEach((r, i) => { r.classList.remove("is-visible"); setTimeout(() => r.classList.add("is-visible"), 40 + i * 50); });
      bars.forEach((el, i) => { el.style.width = "0%"; setTimeout(() => { el.style.width = el.dataset.bar + "%"; }, 180 + i * 22); });
      polys.forEach((p) => { p.style.transform = "scale(0.1)"; p.style.opacity = "0"; setTimeout(() => { p.style.transform = "scale(1)"; p.style.opacity = "1"; }, 280); });
      counts.forEach((el) => { el.textContent = (el.dataset.prefix || "") + "0" + (el.dataset.suffix || ""); });
      setTimeout(() => counts.forEach((el) => countUp(el)), 220);
    };
    const openReport = (e) => {
      if (e) e.preventDefault();
      activateReport();
      reportModal.classList.add("open");
      reportModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    };
    const closeReport = () => {
      reportModal.classList.remove("open");
      reportModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    };
    $$("[data-open-report]").forEach((b) => b.addEventListener("click", openReport));
    $$("[data-close-report]").forEach((b) => b.addEventListener("click", closeReport));
    reportModal.addEventListener("click", (e) => { if (e.target === reportModal) closeReport(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && reportModal.classList.contains("open")) closeReport(); });
  }

  /* ---------- Typewriter heading ---------- */
  const twEl = $(".typewriter[data-type]");
  if (twEl && !prefersReduced && "IntersectionObserver" in window) {
    const full = twEl.textContent;
    twEl.setAttribute("aria-label", full);
    const tnode = document.createTextNode("");
    const caret = document.createElement("span");
    caret.className = "tw-caret";
    twEl.textContent = "";
    twEl.appendChild(tnode);
    twEl.appendChild(caret);
    let started = false;
    const tio = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          tio.disconnect();
          let i = 0;
          const type = () => {
            tnode.nodeValue = full.slice(0, i);
            i++;
            if (i <= full.length) setTimeout(type, 42);
          };
          type();
        }
      });
    }, { threshold: 0.35 });
    tio.observe(twEl);
  }

  /* ---------- Magnetic section dots ---------- */
  const magDots = $$(".section-dots a");
  if (magDots.length && !prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    let mTick = false;
    const RAD = 95;
    window.addEventListener("pointermove", (e) => {
      if (mTick) return;
      mTick = true;
      requestAnimationFrame(() => {
        mTick = false;
        if (e.clientX < window.innerWidth - 170) {
          magDots.forEach((d) => { if (d.style.translate) d.style.translate = ""; });
          return;
        }
        magDots.forEach((d) => {
          const r = d.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const dist = Math.hypot(dx, dy);
          if (dist < RAD) {
            const pull = 1 - dist / RAD;
            d.style.translate = (dx * pull * 0.45).toFixed(1) + "px " + (dy * pull * 0.45).toFixed(1) + "px";
          } else if (d.style.translate) {
            d.style.translate = "";
          }
        });
      });
    }, { passive: true });
  }

  /* ---------- One-time stroke draw of the badge icons ---------- */
  const crestEls = $$(".crest");
  if (crestEls.length && !prefersReduced && "IntersectionObserver" in window) {
    const geom = "path, circle, rect, line, polygon, polyline, ellipse";
    crestEls.forEach((crest) => {
      crest.querySelectorAll(geom).forEach((el) => {
        let len = 0;
        try { len = el.getTotalLength(); } catch (err) {}
        if (!len) return;
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
        el.style.transition = "stroke-dashoffset 0.85s var(--ease)";
      });
    });
    const crestRow = $(".crest-row");
    if (crestRow) {
      const cio = new IntersectionObserver((ents, obs) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            obs.disconnect();
            crestEls.forEach((crest, i) => {
              setTimeout(() => {
                crest.querySelectorAll(geom).forEach((el) => { el.style.strokeDashoffset = "0"; });
              }, i * 85);
            });
          }
        });
      }, { threshold: 0.25 });
      cio.observe(crestRow);
    }
  }

  /* ---------- Button click ripple ---------- */
  $$(".btn").forEach((btn) => {
    btn.addEventListener("pointerdown", (e) => {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = (e.clientX - r.left - size / 2) + "px";
      span.style.top = (e.clientY - r.top - size / 2) + "px";
      btn.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    });
  });

  /* ---------- Backstop: never leave the hero hidden if the loader stalls ---------- */
  setTimeout(() => document.body.classList.add("is-loaded"), 6000);
})();
