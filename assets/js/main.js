/*!
 * Cyril Cheung — Portfolio V2
 * MAIN SCRIPT — 每一頁都用（喺每頁自己嘅 script 之前載入）
 *
 * 全站共用嘅功能都喺呢度，每頁嘅 script 用 window.Site 呼叫：
 *   Site.pageReady(ms)      等字體載好（最多 ms）先開始入場動畫
 *   Site.solidHeader()      捲動後頁頭變實色
 *   Site.backToTop()        「Back to top」順滑捲返頂
 *   Site.reveal(els, opts)  捲到先淡入（加 .is-in）
 *   Site.onEnter(els, fn)   捲到先做 fn（只做一次）
 *   Site.viewer({...})      作品 / 影片彈出視窗（開、關、上下一個、Back 鍵、swipe）
 *   Site.img(...), Site.el(...)  建立元素嘅小工具
 * 手機選單（☰）會自動啟動，唔使每頁再寫。
 *
 * 1. Helpers
 * 2. Mobile menu (auto)
 * 3. Page ready / header / back to top / reveals
 * 4. Viewer (shared by Design + AI + Video)
 * 5. Data helpers (read the files in assets/data/)
 * 6. Image protection (right-click / drag / long-press on images and videos)
 */
(function () {
  'use strict';

  /* =====================================================================
     1. HELPERS
     ===================================================================== */
  var root = document.documentElement;
  var mq = function (q) { return window.matchMedia(q).matches; };

  var Site = window.Site = {
    protectImages: true,       // false = 唔再阻止右鍵 / 拖曳 / 長按存圖
    root: root,
    reducedMotion: mq('(prefers-reduced-motion: reduce)'),
    finePointer: mq('(hover: hover) and (pointer: fine)'),
    hasIO: 'IntersectionObserver' in window,
    saveData: !!(navigator.connection && navigator.connection.saveData),
    header: document.querySelector('[data-header]')
  };

  Site.$ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  Site.$$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  Site.wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  Site.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  Site.quietPlay = function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
  Site.fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready.catch(function () {}) : Promise.resolve();

  // Small element builder: Site.el('p', 'class-name', 'text')
  Site.el = function (tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  var $ = Site.$, $$ = Site.$$;


  /* =====================================================================
     2. MOBILE MENU (runs on every page)
     ===================================================================== */
  var menuBtn = $('[data-menu-btn]');
  var menuOpen = false;
  function setMenu(open) {
    menuOpen = open;
    Site.header.classList.toggle('is-menu-open', open);
    root.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Menu';
  }
  if (menuBtn && Site.header) {
    menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });
    $$('.site-nav a').forEach(function (a) {
      a.addEventListener('click', function () { if (menuOpen) setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (m) {
      if (m.matches && menuOpen) setMenu(false);
    });
  }


  /* =====================================================================
     3. PAGE READY / HEADER / BACK TO TOP / REVEALS
     ===================================================================== */
  // Adds .is-ready to <html> once fonts are in (never waits longer than ms)
  Site.pageReady = function (ms) {
    return Promise.race([Site.fontsReady, Site.wait(ms || 800)]).then(function () {
      return new Promise(function (resolve) {
        requestAnimationFrame(function () { root.classList.add('is-ready'); resolve(); });
      });
    });
  };

  // Header turns solid after scrolling. extra(y) runs on the same frame (optional).
  Site.solidHeader = function (extra) {
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.pageYOffset;
      Site.header.classList.toggle('is-solid', y > 10);
      if (extra) extra(y);
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  };

  Site.backToTop = function () {
    var link = $('[data-to-top]');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: Site.reducedMotion ? 'auto' : 'smooth' });
    });
  };

  // Run fn(el, indexInBatch) when each element scrolls into view (once)
  Site.onEnter = function (els, fn, options) {
    if (!Site.hasIO || Site.reducedMotion) { els.forEach(function (el, i) { fn(el, i); }); return; }
    var io = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        fn(en.target, batch++);
      });
    }, options || { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  };

  Site.reveal = function (els, options) {
    Site.onEnter(els || $$('[data-reveal]'), function (el) { el.classList.add('is-in'); }, options);
  };

  // Masonry: each card spans as many small rows as it is tall
  Site.masonry = function (grid, itemSel, rowUnit) {
    var items = function () { return $$(itemSel, grid); };
    function layout() {
      var list = items();
      list.forEach(function (it) { if (!it.hidden) it.style.gridRowEnd = 'auto'; });
      list.forEach(function (it) {
        if (it.hidden) return;
        it.style.gridRowEnd = 'span ' + Math.max(1, Math.ceil(it.getBoundingClientRect().height / rowUnit));
      });
    }
    grid.classList.add('is-masonry');
    var lastWidth = 0;
    if ('ResizeObserver' in window) {
      new ResizeObserver(function (entries) {
        var w = entries[0].contentRect.width;
        if (Math.abs(w - lastWidth) > 0.5) { lastWidth = w; layout(); }
      }).observe(grid);
    } else {
      window.addEventListener('resize', layout);
    }
    Site.fontsReady.then(layout);
    layout();
    return layout;
  };


  /* =====================================================================
     4. VIEWER — the full-screen dialog used by Design and AI + Video.
     The page tells it how to fill one item; this part handles the rest:
     open / close, ← → keys, swipe, Prev / Next, browser Back, and links
     straight to one item (page.html#item-id).
     ===================================================================== */
  Site.viewer = function (opt) {
    var dialog = opt.dialog;
    if (!dialog || typeof dialog.showModal !== 'function') return null;   // very old browsers

    var V = {
      count: $('[data-v-count]', dialog),
      prev: $('[data-v-prev]', dialog),
      next: $('[data-v-next]', dialog),
      close: $('[data-v-close]', dialog),
      media: $('[data-v-media]', dialog),
      info: $('.viewer-info', dialog)
    };
    var swapFade = opt.swapFade || 200;
    var swipeDistance = opt.swipeDistance || 70;
    var active = null, pushed = false;

    function fill(item) {
      opt.fill(item);
      var list = opt.list();
      V.count.textContent = Site.pad(list.indexOf(item) + 1) + ' / ' + Site.pad(list.length);
      V.prev.hidden = V.next.hidden = list.length < 2;
      active = item;
    }

    function swap(item) {
      if (Site.reducedMotion) { fill(item); dialog.scrollTop = 0; return; }
      V.media.classList.add('is-swapping');
      V.info.classList.add('is-swapping');
      setTimeout(function () {
        fill(item);
        dialog.scrollTop = 0;
        requestAnimationFrame(function () {
          V.media.classList.remove('is-swapping');
          V.info.classList.remove('is-swapping');
        });
      }, swapFade);
    }

    function open(item, how) {
      if (opt.beforeOpen) opt.beforeOpen(item);
      if (!dialog.open) {
        fill(item);
        dialog.classList.remove('is-closing');
        dialog.showModal();
        root.classList.add('lock-scroll');
        dialog.scrollTop = 0;
        V.close.focus();
      } else {
        swap(item);
      }
      var url = '#' + item.id;
      if (how === 'push') { history.pushState({ viewer: item.id }, '', url); pushed = true; }
      else if (how === 'replace') { history.replaceState(history.state, '', url); }
    }

    function step(dir) {
      var list = opt.list();
      if (list.length < 2 || !active) return;
      if (opt.onStep) opt.onStep();
      open(list[(list.indexOf(active) + dir + list.length) % list.length], 'replace');
    }

    function finishClose() {
      if (!dialog.open) return;
      var done = function () {
        if (opt.afterClose) opt.afterClose();
        dialog.close();
        dialog.classList.remove('is-closing');
        root.classList.remove('lock-scroll');
        var back = active && opt.focusBack ? opt.focusBack(active) : null;
        if (back) back.focus({ preventScroll: true });
        active = null;
      };
      if (Site.reducedMotion) { done(); return; }
      dialog.classList.add('is-closing');
      setTimeout(done, 240);
    }

    function close() {
      if (pushed) { pushed = false; history.back(); }          // popstate → finishClose
      else {
        history.replaceState(history.state, '', location.pathname + location.search);
        finishClose();
      }
    }

    V.close.addEventListener('click', close);
    V.prev.addEventListener('click', function () { step(-1); });
    V.next.addEventListener('click', function () { step(1); });
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); close(); });   // Esc
    dialog.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'VIDEO') return;                 // arrows seek inside a video
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });

    var tx = 0, ty = 0, onPlayer = false;
    dialog.addEventListener('touchstart', function (e) {
      onPlayer = e.target.tagName === 'VIDEO' || e.target.tagName === 'IFRAME';
      tx = e.touches[0].clientX; ty = e.touches[0].clientY;
    }, { passive: true });
    dialog.addEventListener('touchend', function (e) {
      if (onPlayer) return;                                     // don't fight video scrubbing
      var dx = e.changedTouches[0].clientX - tx;
      var dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > swipeDistance && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    }, { passive: true });

    window.addEventListener('popstate', function () {
      var target = location.hash ? opt.find(location.hash.slice(1)) : null;
      if (target) open(target);
      else { pushed = false; finishClose(); }
    });

    // Arrived with a link like design.html#yi-ming-tong
    var start = location.hash ? opt.find(decodeURIComponent(location.hash.slice(1))) : null;
    if (start) open(start);

    return { open: open, close: close };
  };


  /* =====================================================================
     5. DATA HELPERS — read the simple lines used in assets/data/*.js
     "01.webp 1800x1200 | Caption"  →  { file, w, h, caption }
     ===================================================================== */
  Site.parseImage = function (line) {
    var parts = String(line).split('|');
    var bits = parts[0].trim().split(/\s+/);
    var size = (bits[1] || '').match(/^(\d+)\s*[x×]\s*(\d+)$/i);
    return {
      file: bits[0],
      w: size ? +size[1] : 0,
      h: size ? +size[2] : 0,
      caption: (parts.slice(1).join('|') || '').trim()
    };
  };

  // <img> with width/height (stops the page jumping) — size is optional
  Site.img = function (src, info, alt, eager) {
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    if (info.w && info.h) { img.width = info.w; img.height = info.h; }
    img.decoding = 'async';
    if (!eager) img.loading = 'lazy';
    img.addEventListener('error', function () {
      // Missing file: say which one in the console, and on the page when the URL has ?check
      console.warn('[portfolio] image not found:', src);
      if (/[?&]check\b/.test(location.search)) {
        var tag = Site.el('span', 'missing-file', '找不到圖片: ' + src);
        img.replaceWith(tag);
      }
    });
    return img;
  };

  // Shown in the grid when a data file has a typo and can't load
  Site.dataError = function (container, file) {
    var p = Site.el('p', 'data-error');
    p.innerHTML = '作品資料載入唔到 — 請檢查 <code>' + file + '</code>（通常係少咗逗號 , 或者引號 \'）。<br>' +
      'The project list could not load — check <code>' + file + '</code>.';
    container.appendChild(p);
    console.error('[portfolio] data file missing or has an error:', file);
  };


  /* =====================================================================
     6. IMAGE PROTECTION — 防止隨手存圖
     Blocks right-click, dragging and the phone long-press menu on images
     and videos. It stops casual saving only: nobody can block screenshots,
     and every image the browser shows can still be found by someone
     technical. The images are web-size (max ~1800px), never the originals.
     ===================================================================== */
  if (Site.protectImages) {
    root.classList.add('protect-media');
    var isMedia = function (t) {
      return t && t.closest && t.closest('img, video, picture, .dz-thumb, .vx-thumb, .work-media, .viewer-media, .hero-card-media');
    };
    document.addEventListener('contextmenu', function (e) { if (isMedia(e.target)) e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { if (isMedia(e.target)) e.preventDefault(); });
  }
})();
