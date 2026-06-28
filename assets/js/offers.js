/* PlayerDNA offers — interactive flip-through booklets (page images rendered from the PDFs). */
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
  var book = modal.querySelector(".ofb-book");
  var topImg = modal.querySelector(".ofb-top");
  var underImg = modal.querySelector(".ofb-under");
  var titleEl = modal.querySelector(".ofb-title");
  var counter = modal.querySelector(".ofb-counter");
  var dl = modal.querySelector(".ofb-download");
  var prevBtn = modal.querySelector(".ofb-prev");
  var nextBtn = modal.querySelector(".ofb-next");
  var stage = modal.querySelector(".ofb-stage");
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(.46,.03,.28,.99)";
  var DUR = 580;
  var cur = { slug: null, page: 1, busy: false };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function path(slug, p) { return "/assets/img/offers/" + slug + "/p" + pad(p) + ".jpg"; }
  function preload(slug, p) { var o = OFFERS[slug]; if (p >= 1 && p <= o.pages) { var i = new Image(); i.src = path(slug, p); } }

  function render() {
    var o = OFFERS[cur.slug];
    counter.textContent = cur.page + " / " + o.pages;
    prevBtn.disabled = cur.page <= 1;
    nextBtn.disabled = cur.page >= o.pages;
    preload(cur.slug, cur.page + 1);
    preload(cur.slug, cur.page - 1);
  }

  function open(slug) {
    var o = OFFERS[slug];
    if (!o) return;
    cur.slug = slug; cur.page = 1; cur.busy = false;
    titleEl.textContent = o.title;
    dl.setAttribute("href", o.pdf);
    topImg.style.transition = "none";
    topImg.style.transform = "rotateY(0deg)";
    topImg.src = path(slug, 1);
    underImg.src = path(slug, 1);
    book.classList.remove("flipping");
    render();
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    modal.setAttribute("aria-hidden", "false");
  }
  function close() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    modal.setAttribute("aria-hidden", "true");
  }

  // Realistic page-turn: the top page rotates around the spine (left edge),
  // revealing the page beneath. backface-visibility hides the blank back once
  // it passes 90deg, so it reads as a real page lifting and turning over.
  function go(dir) {
    if (cur.busy || !cur.slug) return;
    var o = OFFERS[cur.slug];
    var np = cur.page + dir;
    if (np < 1 || np > o.pages) return;

    if (REDUCED) {
      cur.page = np; topImg.src = path(cur.slug, np); underImg.src = path(cur.slug, np); render(); return;
    }

    cur.busy = true;
    topImg.style.transition = "none";
    if (dir > 0) {
      underImg.src = path(cur.slug, np);          // next page sits beneath, revealed
      topImg.src = path(cur.slug, cur.page);      // current page is the one turning away
      topImg.style.transform = "rotateY(0deg)";
      void topImg.offsetWidth;                    // reflow before animating
      topImg.style.transition = "transform " + DUR + "ms " + EASE;
      topImg.style.transform = "rotateY(-172deg)";
    } else {
      underImg.src = path(cur.slug, cur.page);    // current page stays beneath
      topImg.src = path(cur.slug, np);            // previous page swings back in
      topImg.style.transform = "rotateY(172deg)";
      void topImg.offsetWidth;
      topImg.style.transition = "transform " + DUR + "ms " + EASE;
      topImg.style.transform = "rotateY(0deg)";
    }
    book.classList.add("flipping");
    setTimeout(function () {
      cur.page = np;
      topImg.style.transition = "none";
      topImg.src = path(cur.slug, np);
      topImg.style.transform = "rotateY(0deg)";
      underImg.src = path(cur.slug, np);
      void topImg.offsetWidth;
      book.classList.remove("flipping");
      render();
      cur.busy = false;
    }, DUR);
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-offer]"), function (c) {
    c.addEventListener("click", function (e) { e.preventDefault(); open(c.getAttribute("data-offer")); });
    c.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(c.getAttribute("data-offer")); }
    });
  });
  prevBtn.addEventListener("click", function () { go(-1); });
  nextBtn.addEventListener("click", function () { go(1); });
  Array.prototype.forEach.call(modal.querySelectorAll("[data-ofb-close]"), function (b) { b.addEventListener("click", close); });
  modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  window.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
  });
  var sx = null;
  stage.addEventListener("click", function (e) {
    if (e.target.closest(".ofb-nav")) return;
    var r = topImg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
    go(e.clientX > r.left + r.width / 2 ? 1 : -1);
  });
  stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
