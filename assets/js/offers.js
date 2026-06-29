/* PlayerDNA offers — realistic interactive open-book viewer (PDF pages rendered to images). */
(function () {
  "use strict";
  var OFFERS = {
    "franchise-prospectus": { title: "Franchise Prospectus", pages: 12, pdf: "/assets/pdf/franchise-prospectus.pdf" },
    "match-analysis": { title: "Full Match Analysis", pages: 4, pdf: "/assets/pdf/match-analysis.pdf" },
    "neuroscience-test": { title: "Neuroscience Test", pages: 5, pdf: "/assets/pdf/neuroscience-test.pdf" },
    "technical-financial": { title: "Technical & Financial Proposal", pages: 11, pdf: "/assets/pdf/technical-financial.pdf" }
  };

  var modal = document.getElementById("offerBook");
  if (!modal) return;
  var obook = modal.querySelector(".ofb-obook");
  var bkLeft = modal.querySelector("#ofbLeft"), bkRight = modal.querySelector("#ofbRight");
  var leaf = modal.querySelector("#ofbLeaf"), leafFront = modal.querySelector("#ofbLeafFront"), leafBack = modal.querySelector("#ofbLeafBack");
  var titleEl = modal.querySelector(".ofb-title");
  var counter = modal.querySelector(".ofb-counter");
  var dl = modal.querySelector(".ofb-download");
  var prevBtn = modal.querySelector(".ofb-prev");
  var nextBtn = modal.querySelector(".ofb-next");
  var stage = modal.querySelector(".ofb-stage");
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cur = { slug: null, pages: 0, page: 0, perView: 2, animating: false, gen: 0 };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function path(slug, i1) { return "/assets/img/offers/" + slug + "/p" + pad(i1) + ".jpg"; }
  function preload(slug, i0) { if (i0 >= 0 && i0 < cur.pages) { var im = new Image(); im.src = path(slug, i0 + 1); } }
  // i0 = 0-based page index; returns "" (blank) when out of range
  function html(i0) { return (i0 >= 0 && i0 < cur.pages) ? '<img src="' + path(cur.slug, i0 + 1) + '" alt="Page ' + (i0 + 1) + '" draggable="false" />' : ""; }
  function paint(el, i0) { var h = html(i0); el.innerHTML = h; el.classList.toggle("is-blank", h === ""); }

  function isMobile() { return window.matchMedia("(max-width: 640px)").matches; }
  function recompute() { cur.perView = isMobile() ? 1 : 2; if (cur.perView === 2) cur.page = Math.floor(cur.page / 2) * 2; }

  function renderStatic() {
    obook.classList.toggle("is-single", cur.perView === 1);
    if (cur.perView === 2) { paint(bkLeft, cur.page); paint(bkRight, cur.page + 1); }
    else { bkLeft.innerHTML = ""; bkLeft.classList.add("is-blank"); paint(bkRight, cur.page); }
    var l = cur.page + 1, r = Math.min(cur.page + cur.perView, cur.pages);
    counter.textContent = (cur.perView === 2 && r > l ? l + "–" + r : "" + l) + " / " + cur.pages;
    prevBtn.disabled = cur.page <= 0;
    nextBtn.disabled = cur.page + cur.perView >= cur.pages;
    preload(cur.slug, cur.page + 2); preload(cur.slug, cur.page + 3);
    preload(cur.slug, cur.page - 1); preload(cur.slug, cur.page - 2);
  }

  function setupLeaf(dir) {
    if (cur.perView === 2) {
      if (dir > 0) { paint(leafFront, cur.page + 1); paint(leafBack, cur.page + 2); paint(bkRight, cur.page + 3); leaf.className = "obook-leaf is-next"; }
      else { paint(leafFront, cur.page); paint(leafBack, cur.page - 1); paint(bkLeft, cur.page - 2); leaf.className = "obook-leaf is-prev"; }
    } else {
      paint(leafFront, cur.page); paint(leafBack, dir > 0 ? cur.page + 1 : cur.page - 1); paint(bkRight, dir > 0 ? cur.page + 1 : cur.page - 1);
      leaf.className = "obook-leaf is-single " + (dir > 0 ? "is-next" : "is-prev");
    }
  }

  function flip(dir) {
    if (cur.animating || !cur.slug) return;
    if (dir > 0 && cur.page + cur.perView >= cur.pages) return;
    if (dir < 0 && cur.page <= 0) return;
    if (REDUCED) { cur.page += dir * cur.perView; renderStatic(); return; }
    cur.animating = true;
    setupLeaf(dir);
    void leaf.offsetWidth;
    leaf.classList.add("flipping");
    var myGen = ++cur.gen;
    var done = function () {
      if (myGen !== cur.gen || !cur.animating) return;
      cur.page += dir * cur.perView;
      renderStatic();
      leaf.className = "obook-leaf";
      cur.animating = false;
    };
    leaf.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 1000); // fallback
  }

  function open(slug) {
    var o = OFFERS[slug];
    if (!o) return;
    cur.slug = slug; cur.pages = o.pages; cur.page = 0; cur.animating = false; cur.gen++;
    titleEl.textContent = o.title;
    dl.setAttribute("href", o.pdf);
    leaf.className = "obook-leaf";
    recompute();
    renderStatic();
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    modal.setAttribute("aria-hidden", "false");
    obook.classList.remove("ofb-opening"); void obook.offsetWidth; obook.classList.add("ofb-opening");
  }
  function close() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    modal.setAttribute("aria-hidden", "true");
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-offer]"), function (c) {
    c.addEventListener("click", function (e) { e.preventDefault(); open(c.getAttribute("data-offer")); });
    c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(c.getAttribute("data-offer")); } });
  });
  prevBtn.addEventListener("click", function () { flip(-1); });
  nextBtn.addEventListener("click", function () { flip(1); });
  Array.prototype.forEach.call(modal.querySelectorAll("[data-ofb-close]"), function (b) { b.addEventListener("click", close); });
  modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  window.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") flip(1);
    else if (e.key === "ArrowLeft") flip(-1);
  });
  // tap a side of the book to turn; swipe on touch
  obook.addEventListener("click", function (e) {
    var r = obook.getBoundingClientRect();
    flip(e.clientX > r.left + r.width / 2 ? 1 : -1);
  });
  var sx = null;
  stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) flip(dx < 0 ? 1 : -1);
  }, { passive: true });
  var rt;
  window.addEventListener("resize", function () {
    if (!modal.classList.contains("open")) return;
    clearTimeout(rt);
    rt = setTimeout(function () { var p = cur.perView; recompute(); if (cur.perView !== p) renderStatic(); }, 150);
  });
})();
