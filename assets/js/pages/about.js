/*!
 * Cyril Cheung — Portfolio V2
 * ABOUT PAGE SCRIPT (about.html) — plain JavaScript, no libraries.
 *
 * 1. Settings
 * 2. Helpers
 * 3. Page ready, header, back to top   (shared code: assets/js/main.js)
 * 4. English ↔ Chinese flip (hover on desktop, tap on phones)
 * 5. Typewriter bio
 * 6. Scroll reveal
 */
(function () {
  'use strict';

  /* =====================================================================
     1. SETTINGS
     ===================================================================== */
  var CONFIG = {
    // Typewriter (first bio paragraph)
    typeSpeed: 20,          // base ms per character (lower = faster)
    typeJitter: 18,         // random extra ms per character, feels human
    typePause: 160,         // extra pause after , . —
    caretLinger: 2200,      // caret blinks this long after typing, then fades
    afterTypeStagger: 140,  // ms between the blocks that fade in after typing

    // Flip
    hoverLeaveDelay: 80     // ms before switching back to English when the mouse leaves
  };


  /* =====================================================================
     2. HELPERS
     ===================================================================== */
  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }



  /* =====================================================================
     3. PAGE — ready, header, back to top (shared code in assets/js/main.js)
     ===================================================================== */
  var S = window.Site;
  S.pageReady(900).then(function () {
    setTimeout(function () { root.classList.add('is-settled'); }, reducedMotion ? 0 : 1600);
  });
  S.solidHeader();
  S.backToTop();


  /* =====================================================================
     4. ENGLISH ↔ CHINESE FLIP
     Desktop: hover shows Chinese; click pins it (click again to unpin).
     Phones:  tap shows Chinese, tap again shows English.
     Keyboard: Enter / Space toggles.
     Screen readers hear whichever language is showing.
     ===================================================================== */
  var hint = $('.ab-hint');
  var flips = $$('[data-flip]');

  flips.forEach(function (btn) {
    var en = $('.flip-en', btn);
    var zh = $('.flip-zh', btn);
    var pinned = false;
    var hovered = false;
    var leaveTimer = 0;

    function render() {
      var showZh = pinned || hovered;
      btn.classList.toggle('is-zh', showZh);
      btn.setAttribute('aria-pressed', String(pinned));
      en.setAttribute('aria-hidden', String(showZh));
      zh.setAttribute('aria-hidden', String(!showZh));
      if (showZh && hint) hint.classList.add('is-used');
    }

    btn.setAttribute('aria-describedby', 'flip-help');
    render();

    btn.addEventListener('click', function () {
      pinned = !pinned;
      if (!pinned) hovered = false;                // desktop: clicking again returns to English at once
      render();
    });

    if (canHover) {
      btn.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(leaveTimer);
        hovered = true;
        render();
      });
      btn.addEventListener('pointerleave', function (e) {
        if (e.pointerType !== 'mouse') return;
        leaveTimer = setTimeout(function () { hovered = false; render(); }, CONFIG.hoverLeaveDelay);
      });
    }
  });


  /* =====================================================================
     5. TYPEWRITER BIO
     Text is split into characters but keeps its final layout from the
     start (characters are only invisible), so nothing jumps. The full
     sentence stays readable to screen readers. Click to skip.
     ===================================================================== */
  var typeEl = $('[data-typewriter]');
  var afterEls = $$('[data-after-type]');
  var tw = buildTypewriter(typeEl);

  function showAfter() {
    afterEls.forEach(function (el, i) {
      el.style.setProperty('--ad', (i * CONFIG.afterTypeStagger) + 'ms');
      el.classList.add('is-in');
    });
  }

  function buildTypewriter(el) {
    if (!el) return null;
    var parts = [];
    Array.prototype.forEach.call(el.childNodes, function (node) {
      var text = (node.textContent || '').replace(/\s+/g, ' ');
      if (text) parts.push({ text: text, strong: node.nodeName === 'STRONG' });
    });
    if (!parts.length) return null;
    parts[0].text = parts[0].text.replace(/^\s+/, '');
    parts[parts.length - 1].text = parts[parts.length - 1].text.replace(/\s+$/, '');

    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = parts.map(function (p) { return p.text; }).join('');
    var visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');

    var chars = [];
    parts.forEach(function (part) {
      var seg = document.createElement(part.strong ? 'strong' : 'span');
      part.text.split(/(\s+)/).forEach(function (token) {
        if (!token) return;
        var holder = seg;
        if (!/^\s+$/.test(token)) {
          holder = document.createElement('span');
          holder.className = 'tw-word';
          seg.appendChild(holder);
        }
        for (var i = 0; i < token.length; i++) {
          var c = document.createElement('span');
          c.className = 'tw-char';
          c.textContent = token[i];
          holder.appendChild(c);
          chars.push(c);
        }
      });
      visual.appendChild(seg);
    });
    el.textContent = '';
    el.appendChild(sr);
    el.appendChild(visual);

    var caret = document.createElement('span');
    caret.className = 'tw-caret';
    return { el: el, chars: chars, caret: caret, done: false, timer: 0 };
  }

  function finishTyping(t) {
    if (t.done) return;
    t.done = true;
    clearTimeout(t.timer);
    t.chars.forEach(function (c) { c.classList.add('is-on'); });
    var last = t.chars[t.chars.length - 1];
    last.appendChild(t.caret);
    t.caret.classList.add('is-idle');
    setTimeout(function () { t.caret.classList.add('is-gone'); }, CONFIG.caretLinger);
    showAfter();
  }

  function runTypewriter(t) {
    var i = 0;
    function step() {
      if (t.done) return;
      var c = t.chars[i];
      c.classList.add('is-on');
      c.appendChild(t.caret);
      i++;
      if (i >= t.chars.length) { finishTyping(t); return; }
      var ch = c.textContent;
      var delay = CONFIG.typeSpeed + Math.random() * CONFIG.typeJitter;
      if (/[,.;:!?—–]/.test(ch)) delay += CONFIG.typePause;
      else if (ch === ' ') delay *= 0.6;
      t.timer = setTimeout(step, delay);
    }
    step();
  }

  if (tw) {
    if (reducedMotion || !hasIO) {
      finishTyping(tw);
    } else {
      tw.el.addEventListener('click', function () { finishTyping(tw); });   // click to skip
      var typeIO = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          typeIO.disconnect();
          setTimeout(function () { runTypewriter(tw); }, 250);
        }
      }, { threshold: 0.6 });
      typeIO.observe(tw.el);
    }
  } else {
    showAfter();
  }


  /* =====================================================================
     6. SCROLL REVEAL
     ===================================================================== */
  S.reveal($$('[data-reveal]'), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
})();
