/*!
 * Cyril Cheung — Portfolio V2
 * DESIGN PAGE SCRIPT (design.html)
 * 作品內容唔喺呢度改 —— 去 assets/data/design.js
 *
 * 1. Settings
 * 2. Build the cards from assets/data/design.js
 * 3. Page: ready, header, back to top
 * 4. Masonry + filter tabs
 * 5. Scroll reveal + "View" cursor
 * 6. Project viewer
 */
(function () {
  'use strict';

  /* =====================================================================
     1. SETTINGS
     ===================================================================== */
  var CONFIG = {
    folder: 'assets/work/design/',   // each project = one folder named after its id
    tallestThumb: 0.6,     // thumbnails taller than this (width ÷ height) are cropped to it
    rowUnit: 4,            // masonry row height in px — keep in sync with .dz-grid.is-masonry in CSS
    filterFade: 220,       // ms grid fade when switching category (also --dur-filter in CSS)
    revealStagger: 90,     // ms between columns when projects fade in
    swipeDistance: 70,     // px a swipe must travel to change project in the viewer (touch)
    swapFade: 200          // ms fade when moving to the previous / next project
  };

  var S = window.Site, $ = S.$, $$ = S.$$, el = S.el;
  var grid = $('[data-grid]');


  /* =====================================================================
     2. BUILD THE CARDS
     ===================================================================== */
  var DATA = (window.DESIGN_PROJECTS || []).filter(function (p) { return p && p.id && !p.hidden; });
  var byId = {};

  function card(p) {
    var dir = CONFIG.folder + p.id + '/';
    var cov = S.parseImage(p.cover || (p.images && p.images[0]) || '');
    var item = el('article', 'dz-item');
    item.id = p.id;
    item.setAttribute('data-cat', (p.cats || []).join(' '));

    var a = el('a', 'dz-card');
    a.href = '#' + p.id;
    a.setAttribute('data-open', '');

    var fig = el('figure', 'dz-thumb');
    fig.appendChild(S.img(dir + cov.file, cov, p.title + ' — ' + (p.type || ''), DATA.indexOf(p) < 4));
    var extra = (p.images || []).length - 1;
    if (extra > 0) fig.appendChild(el('span', 'dz-badge', '+' + extra));

    // keep the artwork's own shape (very tall ones are capped)
    if (cov.w && cov.h) {
      var ratio = cov.w / cov.h;
      if (ratio < CONFIG.tallestThumb) { ratio = CONFIG.tallestThumb; fig.classList.add('is-capped'); }
      fig.style.aspectRatio = String(ratio);
      fig.classList.add('has-ratio');
    }

    var meta = el('div', 'dz-meta');
    meta.appendChild(el('span', 'dz-type', p.type || ''));
    meta.appendChild(el('h2', 'dz-name', p.title));
    if (p.year) meta.appendChild(el('span', 'dz-year', p.year));

    a.appendChild(fig);
    a.appendChild(meta);
    item.appendChild(a);
    byId[p.id] = p;
    return item;
  }

  if (!window.DESIGN_PROJECTS) {
    S.dataError(grid, 'assets/data/design.js');
  } else {
    var frag = document.createDocumentFragment();
    DATA.forEach(function (p) { frag.appendChild(card(p)); });
    grid.appendChild(frag);
  }
  var items = $$('.dz-item', grid);


  /* =====================================================================
     3. PAGE — ready, header (+ filter bar line), back to top
     ===================================================================== */
  var filtersBar = $('[data-filters]');
  var layout = function () {};
  S.pageReady(800).then(function () { layout(); });
  S.solidHeader(function () {
    if (!filtersBar) return;
    var top = filtersBar.getBoundingClientRect().top;
    filtersBar.classList.toggle('is-stuck', top <= S.header.offsetHeight + 1);
  });
  S.backToTop();


  /* =====================================================================
     4. MASONRY + FILTER TABS
     Tabs with no projects hide themselves (e.g. Packaging until you add one).
     ===================================================================== */
  layout = S.masonry(grid, '.dz-item', CONFIG.rowUnit);
  // images without a size in the data file: re-pack once they arrive
  $$('.dz-thumb:not(.has-ratio) img', grid).forEach(function (img) { img.addEventListener('load', layout); });

  var tabs = $$('[data-filter]');
  var emptyMsg = $('[data-empty]');
  var totalEl = $('[data-total]');
  var current = 'all';

  function cats(item) { return (item.getAttribute('data-cat') || '').split(/\s+/); }

  tabs.forEach(function (tab) {
    var f = tab.getAttribute('data-filter');
    var n = f === 'all' ? items.length : items.filter(function (it) { return cats(it).indexOf(f) > -1; }).length;
    $('.dz-count', tab).textContent = n;
    if (n === 0 && f !== 'all') tab.hidden = true;
  });
  if (totalEl) totalEl.textContent = items.length;

  function applyFilter(f) {
    var shown = 0;
    items.forEach(function (item) {
      var show = f === 'all' || cats(item).indexOf(f) > -1;
      item.hidden = !show;
      if (show) shown++;
    });
    if (emptyMsg) emptyMsg.hidden = shown > 0;
    layout();
  }

  function setFilter(f) {
    if (f === current) return;
    current = f;
    tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t.getAttribute('data-filter') === f)); });

    // keep the results in view if the user had scrolled down
    var gridTop = grid.getBoundingClientRect().top + window.pageYOffset - S.header.offsetHeight - filtersBar.offsetHeight;
    var needScroll = window.pageYOffset > gridTop;

    if (S.reducedMotion) {
      applyFilter(f);
      if (needScroll) window.scrollTo(0, gridTop);
      return;
    }
    grid.classList.add('is-switching');
    setTimeout(function () {
      applyFilter(f);
      if (needScroll) window.scrollTo(0, gridTop);
      requestAnimationFrame(function () { grid.classList.remove('is-switching'); });
    }, CONFIG.filterFade);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { setFilter(tab.getAttribute('data-filter')); });
  });


  /* =====================================================================
     5. SCROLL REVEAL (column by column) + "VIEW" CURSOR (desktop)
     ===================================================================== */
  if (S.hasIO && !S.reducedMotion) {
    items.forEach(function (item) { item.classList.add('is-hidden-reveal'); });
    var io = new IntersectionObserver(function (entries) {
      var gridLeft = grid.getBoundingClientRect().left;
      var colW = (grid.clientWidth || 1) / (parseInt(getComputedStyle(grid).getPropertyValue('--cols'), 10) || 1);
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var col = Math.max(0, Math.floor((en.boundingClientRect.left - gridLeft) / colW));
        en.target.style.setProperty('--rd', (col * CONFIG.revealStagger) + 'ms');
        en.target.classList.remove('is-hidden-reveal');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    items.forEach(function (item) { io.observe(item); });
  }

  var cursor = $('[data-cursor]');
  if (cursor && S.finePointer && !S.reducedMotion) {
    S.root.classList.add('has-view-cursor');
    var raf = 0, cx = 0, cy = 0;
    document.addEventListener('pointermove', function (e) {
      cx = e.clientX; cy = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(function () {
          raf = 0;
          cursor.style.setProperty('--cx', cx + 'px');
          cursor.style.setProperty('--cy', cy + 'px');
        });
      }
    }, { passive: true });
    $$('.dz-card').forEach(function (c) {
      c.addEventListener('pointerenter', function () { cursor.classList.add('is-on'); });
      c.addEventListener('pointerleave', function () { cursor.classList.remove('is-on'); });
    });
  } else if (cursor) {
    cursor.remove();
  }


  /* =====================================================================
     6. PROJECT VIEWER — text on one side, every image of the project on the other
     ===================================================================== */
  var dialog = $('[data-viewer]');
  var V = {
    type: $('[data-v-type]', dialog),
    title: $('[data-v-title]', dialog),
    year: $('[data-v-year]', dialog),
    text: $('[data-v-text]', dialog),
    media: $('[data-v-media]', dialog)
  };

  function para(label, text) {
    var p = el('p', 'dz-desc');
    if (label) { p.appendChild(el('strong', null, label + ' ')); }
    p.appendChild(document.createTextNode(text));
    return p;
  }

  function fill(item) {
    var p = byId[item.id];
    var dir = CONFIG.folder + p.id + '/';
    V.type.textContent = p.type || '';
    V.title.textContent = p.title;
    V.year.textContent = p.year || '';

    V.text.textContent = '';
    if (p.about) V.text.appendChild(para('', p.about));
    if (p.brief) V.text.appendChild(para('Brief:', p.brief));
    if (p.idea) V.text.appendChild(para('Idea:', p.idea));
    if (p.result) V.text.appendChild(para('Result:', p.result));
    var dl = el('dl', 'dz-facts');
    [['Client', p.client], ['Role', p.role], ['Tools', p.tools]].forEach(function (f) {
      if (!f[1]) return;
      var row = el('div');
      row.appendChild(el('dt', null, f[0]));
      row.appendChild(el('dd', null, f[1]));
      dl.appendChild(row);
    });
    if (dl.children.length) V.text.appendChild(dl);

    V.media.textContent = '';
    (p.images && p.images.length ? p.images : [p.cover]).forEach(function (line, i) {
      var info = S.parseImage(line);
      var figure = el('figure', 'viewer-figure');
      var img = S.img(dir + info.file, info, info.caption || p.title, i < 2);
      if (info.w && info.h && info.h / info.w > 1.6) img.classList.add('is-tall');
      figure.appendChild(img);
      if (info.caption) figure.appendChild(el('figcaption', null, info.caption));
      V.media.appendChild(figure);
    });
  }

  var viewer = S.viewer({
    dialog: dialog,
    swapFade: CONFIG.swapFade,
    swipeDistance: CONFIG.swipeDistance,
    list: function () { return items.filter(function (it) { return !it.hidden; }); },
    find: function (id) { var t = document.getElementById(id); return t && t.classList.contains('dz-item') ? t : null; },
    fill: fill,
    focusBack: function (item) { return $('.dz-card', item); },
    beforeOpen: function () { if (cursor) cursor.classList.remove('is-on'); },
    afterClose: function () { V.media.textContent = ''; }
  });

  // very old browsers have no viewer: the cards then stay plain links
  if (viewer) {
    $$('[data-open]', grid).forEach(function (c) {
      c.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        viewer.open(c.closest('.dz-item'), 'push');
      });
    });
  }
})();
