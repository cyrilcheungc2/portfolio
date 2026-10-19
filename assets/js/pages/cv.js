/*!
 * Cyril Cheung — Portfolio V2
 * CV PAGE SCRIPT (cv.html) — plain JavaScript, no libraries.
 *
 * 1. Settings
 * 2. Helpers
 * 3. Page ready, header, back to top   (shared code: assets/js/main.js)
 * 4. Experience + education: each entry appears year → title → company → details
 * 5. Core strengths: items rise one by one (no scores)
 * 6. Tools: one clockwise glow lap, then a quiet resting glow
 * 7. Simple reveals
 * 8. 中英對照 switch
 */
(function () {
  'use strict';

  /* =====================================================================
     1. SETTINGS
     ===================================================================== */
  var CONFIG = {
    stepGap: 130,        // ms between year → title → company → details inside one entry
    entryGap: 160,       // ms between entries that appear at the same time
    toolStagger: 120,    // ms between tool icons starting their glow lap
    lapDuration: 1300,   // ms for one lap (match --dur-lap in CSS)
    rememberZh: true     // keep 中英對照 on for the next visit (this browser only)
  };


  /* =====================================================================
     2. HELPERS
     ===================================================================== */
  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasIO = 'IntersectionObserver' in window;
  // the glow needs an animatable CSS angle; older browsers just get the resting state
  var canLap = !!(window.CSS && CSS.registerProperty);

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  // Run fn(el, indexInBatch) when elements scroll into view (once each)
  function onEnter(els, fn, options) {
    if (!hasIO || reducedMotion) { els.forEach(function (el, i) { fn(el, i); }); return; }
    var io = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        fn(en.target, batch++);
      });
    }, options || { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  }



  /* =====================================================================
     3. PAGE — ready, header, back to top (shared code in assets/js/main.js)
     ===================================================================== */
  var S = window.Site;
  S.pageReady(800);
  S.solidHeader();
  S.backToTop();


  /* =====================================================================
     4. EXPERIENCE + EDUCATION — one by one, never all at once
     ===================================================================== */
  root.style.setProperty('--step-gap', CONFIG.stepGap + 'ms');
  var seqEls = $$('[data-seq]');
  seqEls.forEach(function (entry) {
    $$('[data-step]', entry).forEach(function (step, i) { step.style.setProperty('--s', i); });
  });
  onEnter(seqEls, function (entry, i) {
    setTimeout(function () { entry.classList.add('is-in'); }, reducedMotion ? 0 : i * CONFIG.entryGap);
  });


  /* =====================================================================
     5. CORE STRENGTHS — items rise one by one and the divider lines
        draw in (all handled in CSS once the card gets .is-in).
        No scores on purpose.
     ===================================================================== */
  var skillsBox = $('[data-skills]');
  if (skillsBox) {
    onEnter([skillsBox], function () { skillsBox.classList.add('is-in'); }, { threshold: 0.25 });
  }


  /* =====================================================================
     6. TOOLS — a thin glow travels clockwise around each icon ONCE,
        then stops and leaves a quiet resting glow.
        Desktop: hovering an icon plays its lap again.
        Phones:  tapping an icon plays its lap again.
     ===================================================================== */
  var tools = $$('[data-tool]');

  function lap(tool) {
    if (!canLap || reducedMotion) { tool.classList.add('is-done'); return; }
    if (tool.classList.contains('is-lapping')) return;
    tool.classList.add('is-lapping');
    setTimeout(function () {
      tool.classList.remove('is-lapping');
      tool.classList.add('is-done');
    }, CONFIG.lapDuration + 50);
  }

  var toolsBox = $('[data-tools]');
  if (toolsBox) {
    onEnter([toolsBox], function () {
      tools.forEach(function (tool, i) {
        setTimeout(function () { lap(tool); }, reducedMotion ? 0 : i * CONFIG.toolStagger);
      });
    }, { threshold: 0.35 });
  }

  tools.forEach(function (tool) {
    if (canHover) {
      tool.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') lap(tool); });
    } else {
      tool.addEventListener('click', function () { lap(tool); });
    }
    tool.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lap(tool); }
    });
  });


  /* =====================================================================
     7. SIMPLE REVEALS (section titles, languages)
     ===================================================================== */
  onEnter($$('[data-reveal]'), function (el) { el.classList.add('is-in'); });


  /* =====================================================================
     8. 中英對照 SWITCH
     Shows the Chinese line under every English line. Two copies of the
     switch (top of page + floating) always show the same state.
     Screen readers only hear the Chinese lines while they're showing.
     ===================================================================== */
  var KEY = 'cyril-zh';
  var toggles = $$('[data-zh-toggle]');
  var zhLines = $$('.zh');

  function setZh(on, save) {
    root.classList.toggle('show-zh', on);
    toggles.forEach(function (t) { t.setAttribute('aria-pressed', String(on)); });
    zhLines.forEach(function (z) { z.setAttribute('aria-hidden', String(!on)); });
    if (save && CONFIG.rememberZh) {
      try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
    }
  }
  setZh(root.classList.contains('show-zh'), false);   // state restored in <head>

  toggles.forEach(function (t) {
    t.addEventListener('click', function () {
      setZh(!root.classList.contains('show-zh'), true);
    });
  });

  // floating switch: visible once the intro is off screen
  var floatBtn = $('[data-zh-float]');
  var intro = $('[data-intro]');
  if (floatBtn && intro && hasIO) {
    new IntersectionObserver(function (entries) {
      floatBtn.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(intro);
  }
})();
