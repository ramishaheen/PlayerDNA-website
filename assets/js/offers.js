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
  var page = modal.querySelector(".ofb-page");
  var titleEl = modal.querySelector(".ofb-title");
  var counter = modal.querySelector(".ofb-counter");
  var dl = modal.querySelector(".ofb-download");
  var prevBtn = modal.querySelector(".ofb-prev");
  var nextBtn = modal.querySelector(".ofb-next");
  var stage = modal.querySelector(".ofb-stage");
  var cur = { slug: null, page: 1, busy: false };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function path(slug, p) { return "/assets/img/offers/" + slug + "/p" + pad(p) + ".jpg"; }
  function preload(slug, p) {
    var o = OFFERS[slug];
    if (p >= 1 && p <= o.pages) { var i = new Image(); i.src = path(slug, p); }
  }

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
    page.style.transition = "none";
    page.style.transform = "none";
    page.src = path(slug, 1);
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

  // Page-turn: flip the page out around the spine edge, swap image, flip the new page in.
  function go(dir) {
    if (cur.busy || !cur.slug) return;
    var o = OFFERS[cur.slug];
    var np = cur.page + dir;
    if (np < 1 || np > o.pages) return;
    cur.busy = true;
    var out = dir > 0 ? -82 : 82;
    page.style.transformOrigin = dir > 0 ? "left center" : "right center";
    page.style.transition = "transform 0.21s ease-in, box-shadow 0.21s";
    page.classList.add("turning");
    page.style.transform = "perspective(2200px) rotateY(" + out + "deg)";
    setTimeout(function () {
      cur.page = np;
      page.src = path(cur.slug, np);
      page.style.transition = "none";
      page.style.transform = "perspective(2200px) rotateY(" + (-out) + "deg)";
      void page.offsetWidth; // reflow
      page.style.transition = "transform 0.23s ease-out, box-shadow 0.23s";
      page.style.transform = "perspective(2200px) rotateY(0deg)";
      render();
      setTimeout(function () { page.classList.remove("turning"); cur.busy = false; }, 240);
    }, 215);
  }

  // Open booklets from any element with data-offer
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
  // tap left/right half of the page to turn; swipe on touch
  var sx = null;
  stage.addEventListener("click", function (e) {
    if (e.target.closest(".ofb-nav")) return;
    var r = page.getBoundingClientRect();
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
