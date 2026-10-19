/*!
 * Cyril Cheung — Portfolio V2
 * AI + VIDEO PAGE SCRIPT (ai-video.html)
 * 影片內容唔喺呢度改 —— 去 assets/data/videos.js
 *
 * 1. Settings
 * 2. Build featured / grid / shorts from assets/data/videos.js
 * 3. Page: ready, header, back to top, reveals
 * 4. Featured video (plays in place)
 * 5. Video grid: masonry + filters + reveal
 * 6. Hover preview (desktop)
 * 7. Shorts rail arrows
 * 8. Video viewer
 */
(function () {
  'use strict';

  /* =====================================================================
     1. SETTINGS
     ===================================================================== */
  var CONFIG = {
    folder: 'assets/work/video/',   // each video = one folder named after its id
    rowUnit: 4,             // masonry row height in px — keep in sync with .vx-grid.is-masonry
    filterFade: 220,        // ms grid fade when switching category
    revealStagger: 90,      // ms between columns when videos fade in
    hoverPreview: true,     // desktop: play a silent preview while the mouse is on a video
    hoverDelay: 120,        // ms before the preview starts (avoids flicker when passing over)
    swipeDistance: 70,      // px a swipe must travel to change video in the viewer (touch)
    swapFade: 200,          // ms fade when moving to the previous / next video
    youtubeHost: 'https://www.youtube-nocookie.com/embed/'
  };

  var S = window.Site, $ = S.$, $$ = S.$$, el = S.el;
  var grid = $('[data-grid]');
  var featuredBox = $('[data-featured]');
  var shortsBox = $('[data-shorts]');
  var W = window.VIDEO_WORK;
  var byId = {};


  /* =====================================================================
     2. BUILD FROM DATA
     ===================================================================== */
  function size(v) {
    var m = String(v.size || '').match(/(\d+)\s*[x×]\s*(\d+)/i);
    return m ? { w: +m[1], h: +m[2] } : { w: 16, h: 9 };
  }
  function ratioLabel(w, h) {
    var r = w / h;
    var known = [[16 / 9, '16:9'], [9 / 16, '9:16'], [1, '1:1'], [4 / 5, '4:5'], [4 / 3, '4:3'], [3 / 4, '3:4'], [2.39, '2.39:1'], [21 / 9, '21:9']];
    for (var i = 0; i < known.length; i++) if (Math.abs(r - known[i][0]) / known[i][0] < 0.035) return known[i][1];
    return r.toFixed(2) + ':1';
  }
  function src(v, file) { return CONFIG.folder + v.id + '/' + file; }

  function tagItem(item, v) {
    var s = size(v);
    item.id = v.id;
    if (v.youtube) item.setAttribute('data-youtube', v.youtube);
    else item.setAttribute('data-video', src(v, v.video || 'video.mp4'));
    item.setAttribute('data-w', s.w);
    item.setAttribute('data-h', s.h);
    byId[v.id] = v;
  }

  function metaBlock(v, nameTag, nameId) {
    var meta = el('div', 'vx-meta');
    if (v.type) meta.appendChild(el('span', 'vx-type', v.type));
    var name = el(nameTag || 'h3', 'vx-name', v.title);
    if (nameId) name.id = nameId;
    meta.appendChild(name);
    if (v.year) meta.appendChild(el('span', 'vx-year', v.year));
    return meta;
  }

  // Text for the viewer + featured block
  function detail(v) {
    var frag = document.createDocumentFragment();
    var para = function (label, text) {
      var p = el('p', 'vx-desc');
      if (label) p.appendChild(el('strong', null, label + ' '));
      p.appendChild(document.createTextNode(text));
      frag.appendChild(p);
    };
    if (v.about) para('', v.about);
    if (v.idea) para('Idea:', v.idea);
    if (v.direction) para('Direction:', v.direction);
    if (v.result) para('Result:', v.result);
    if (v.note) frag.appendChild(el('p', 'vx-note-line', v.note));
    var dl = el('dl', 'vx-facts');
    [['Client', v.client], ['Role', v.role], ['Tools', v.tools]].forEach(function (f) {
      if (!f[1]) return;
      var row = el('div');
      row.appendChild(el('dt', null, f[0]));
      row.appendChild(el('dd', null, f[1]));
      dl.appendChild(row);
    });
    if (dl.children.length) frag.appendChild(dl);
    return frag;
  }

  function card(v, extraClass) {
    var s = size(v);
    var item = el('article', 'vx-item' + (extraClass ? ' ' + extraClass : ''));
    tagItem(item, v);
    if (v.cats) item.setAttribute('data-cat', v.cats.join(' '));
    if (!extraClass && s.w >= s.h) item.classList.add('is-wide');   // phones: full width

    var a = el('a', 'vx-card');
    a.href = '#' + v.id;
    a.setAttribute('data-open', '');
    var fig = el('figure', 'vx-thumb');
    if (!extraClass) fig.style.aspectRatio = s.w + ' / ' + s.h;
    fig.appendChild(S.img(src(v, v.poster || 'poster.webp'), s, v.title + ' — ' + (v.type || 'video')));
    var play = el('span', 'vx-play');
    play.setAttribute('aria-hidden', 'true');
    play.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>';
    fig.appendChild(play);
    var tags = el('span', 'vx-tags');
    tags.setAttribute('aria-hidden', 'true');
    tags.appendChild(el('span', null, ratioLabel(s.w, s.h)));
    if (v.duration) tags.appendChild(el('span', null, v.duration));
    fig.appendChild(tags);
    a.appendChild(fig);
    a.appendChild(metaBlock(v));
    item.appendChild(a);
    return item;
  }

  function featured(v) {
    var s = size(v);
    var item = el('article', 'vx-item vx-feature');
    tagItem(item, v);
    if (s.h > s.w) item.classList.add('is-portrait');        // 9:16 etc: sized by height

    var media = el('div', 'vx-feature-media');
    media.setAttribute('data-reveal', '');
    var box = el('div', 'vx-inline');
    box.style.aspectRatio = s.w + ' / ' + s.h;
    box.setAttribute('data-inline', '');
    if (v.youtube) {
      var link = el('a', 'vx-bigplay');
      link.href = '#' + v.id;
      link.setAttribute('data-open', '');
      box.appendChild(S.img(src(v, v.poster || 'poster.webp'), s, v.title, true));
      link.innerHTML = '<span class="vx-bigplay-ring" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span><span class="sr-only">Play</span>';
      box.appendChild(link);
    } else {
      var video = document.createElement('video');
      video.src = src(v, v.video || 'video.mp4');
      video.poster = src(v, v.poster || 'poster.webp');
      video.width = s.w; video.height = s.h;
      video.preload = 'none';
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('controlslist', 'nodownload');   // hide the Download button
      video.setAttribute('aria-label', v.title);
      box.appendChild(video);
      var btn = el('button', 'vx-bigplay');
      btn.type = 'button';
      btn.setAttribute('data-inline-play', '');
      btn.innerHTML = '<span class="vx-bigplay-ring" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span><span class="sr-only">Play</span>';
      box.appendChild(btn);
    }
    media.appendChild(box);

    var info = el('div', 'vx-feature-info');
    info.setAttribute('data-reveal', '');
    info.appendChild(el('p', 'kicker', 'Featured project'));
    info.appendChild(metaBlock(v, 'h2', 'featured-title'));
    var text = el('div', 'vx-feature-text');
    text.appendChild(detail(v));
    info.appendChild(text);

    item.appendChild(media);
    item.appendChild(info);
    return item;
  }

  var visible = function (v) { return v && v.id && !v.hidden; };
  if (!W) {
    S.dataError(grid, 'assets/data/videos.js');
  } else {
    if (W.featured && visible(W.featured) && featuredBox) featuredBox.appendChild(featured(W.featured));
    else if (featuredBox) featuredBox.hidden = true;
    var gf = document.createDocumentFragment();
    (W.grid || []).filter(visible).forEach(function (v) { gf.appendChild(card(v)); });
    grid.appendChild(gf);
    var shorts = (W.shorts || []).filter(visible);
    if (shortsBox && shorts.length) {
      var sf = document.createDocumentFragment();
      shorts.forEach(function (v) { sf.appendChild(card(v, 'vx-short')); });
      shortsBox.appendChild(sf);
    } else if (shortsBox) {
      shortsBox.closest('section').hidden = true;
    }
  }

  var gridItems = $$('.vx-item', grid);
  var allItems = $$('.vx-item');          // featured + grid + shorts, in page order (viewer uses this)


  /* =====================================================================
     3. PAGE — ready, header, back to top, reveals
     ===================================================================== */
  var layout = function () {};
  S.pageReady(800).then(function () { layout(); });
  S.solidHeader();
  S.backToTop();
  S.reveal($$('[data-reveal]'), { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });


  /* =====================================================================
     4. FEATURED VIDEO — plays where it is, with sound and controls
     ===================================================================== */
  var inline = $('[data-inline]');
  var inlineVideo = inline ? $('video', inline) : null;
  if (inline && inlineVideo) {
    $('[data-inline-play]', inline).addEventListener('click', function () {
      inlineVideo.controls = true;
      inline.classList.add('is-playing');
      S.quietPlay(inlineVideo);
      inlineVideo.focus({ preventScroll: true });
    });
    if (S.hasIO) {                                   // pause when scrolled away
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting && !inlineVideo.paused) inlineVideo.pause();
      }, { threshold: 0.15 }).observe(inline);
    }
  }


  /* =====================================================================
     5. VIDEO GRID — masonry, filters, reveal
     ===================================================================== */
  layout = S.masonry(grid, '.vx-item', CONFIG.rowUnit);

  var tabs = $$('[data-filter]');
  var current = 'all';
  function cats(it) { return (it.getAttribute('data-cat') || '').split(/\s+/); }
  tabs.forEach(function (tab) {
    var f = tab.getAttribute('data-filter');
    var n = f === 'all' ? gridItems.length : gridItems.filter(function (it) { return cats(it).indexOf(f) > -1; }).length;
    $('.tab-count', tab).textContent = n;
    if (n === 0 && f !== 'all') tab.hidden = true;
  });
  function applyFilter(f) {
    gridItems.forEach(function (it) { it.hidden = !(f === 'all' || cats(it).indexOf(f) > -1); });
    layout();
  }
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var f = tab.getAttribute('data-filter');
      if (f === current) return;
      current = f;
      tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === tab)); });
      if (S.reducedMotion) { applyFilter(f); return; }
      grid.classList.add('is-switching');
      setTimeout(function () {
        applyFilter(f);
        requestAnimationFrame(function () { grid.classList.remove('is-switching'); });
      }, CONFIG.filterFade);
    });
  });

  if (S.hasIO && !S.reducedMotion) {
    gridItems.forEach(function (it) { it.classList.add('is-hidden-reveal'); });
    var gridIO = new IntersectionObserver(function (entries) {
      var left = grid.getBoundingClientRect().left;
      var colW = (grid.clientWidth || 1) / (parseInt(getComputedStyle(grid).getPropertyValue('--cols'), 10) || 1);
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var col = Math.max(0, Math.floor((en.boundingClientRect.left - left) / colW));
        en.target.style.setProperty('--rd', (col * CONFIG.revealStagger) + 'ms');
        en.target.classList.remove('is-hidden-reveal');
        gridIO.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    gridItems.forEach(function (it) { gridIO.observe(it); });
  }


  /* =====================================================================
     6. HOVER PREVIEW (desktop) — silent loop of the real video
     ===================================================================== */
  var previews = [];
  function stopPreviews() { previews.forEach(function (v) { v.pause(); v.classList.remove('is-on'); }); }

  if (CONFIG.hoverPreview && S.finePointer && !S.reducedMotion && !S.saveData) {
    $$('.vx-item[data-video]').forEach(function (it) {
      var card = $('.vx-card', it);
      var thumb = $('.vx-thumb', it);
      if (!card || !thumb) return;                     // the featured video plays in place instead
      var video = null, timer = 0;
      card.addEventListener('pointerenter', function () {
        timer = setTimeout(function () {
          if (!video) {
            video = document.createElement('video');
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.setAttribute('playsinline', '');
            video.setAttribute('controlslist', 'nodownload');   // hide the Download button
            video.setAttribute('aria-hidden', 'true');
            video.preload = 'auto';
            video.src = it.getAttribute('data-video');
            video.addEventListener('playing', function () { video.classList.add('is-on'); });
            thumb.insertBefore(video, thumb.querySelector('.vx-play'));
            previews.push(video);
          }
          S.quietPlay(video);
        }, CONFIG.hoverDelay);
      });
      card.addEventListener('pointerleave', function () {
        clearTimeout(timer);
        if (video) { video.pause(); video.classList.remove('is-on'); }
      });
    });
  }


  /* =====================================================================
     7. SHORTS RAIL ARROWS
     ===================================================================== */
  var rail = $('[data-rail]');
  var railPrev = $('[data-rail-prev]');
  var railNext = $('[data-rail-next]');
  if (rail && railPrev && railNext) {
    var updateRail = function () {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      railPrev.disabled = rail.scrollLeft <= 2;
      railNext.disabled = rail.scrollLeft >= max;
    };
    var by = function (dir) {
      rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: S.reducedMotion ? 'auto' : 'smooth' });
    };
    railPrev.addEventListener('click', function () { by(-1); });
    railNext.addEventListener('click', function () { by(1); });
    rail.addEventListener('scroll', updateRail, { passive: true });
    window.addEventListener('resize', updateRail);
    updateRail();
  }


  /* =====================================================================
     8. VIDEO VIEWER
     Each video plays at its own ratio (never cropped), as large as the
     screen allows. ← / → and swipe move between videos.
     ===================================================================== */
  var dialog = $('[data-viewer]');
  var V = {
    type: $('[data-v-type]', dialog),
    title: $('[data-v-title]', dialog),
    year: $('[data-v-year]', dialog),
    text: $('[data-v-text]', dialog),
    media: $('[data-v-media]', dialog)
  };
  var userOpened = false;

  function buildPlayer(item) {
    var v = byId[item.id];
    var w = parseFloat(item.getAttribute('data-w')) || 16;
    var h = parseFloat(item.getAttribute('data-h')) || 9;
    var frame = el('div', 'viewer-frame');
    frame.style.setProperty('--ar', w + ' / ' + h);
    frame.style.setProperty('--arn', (w / h).toFixed(4));

    var yt = item.getAttribute('data-youtube');
    if (yt) {
      var iframe = document.createElement('iframe');
      iframe.src = CONFIG.youtubeHost + encodeURIComponent(yt) + '?autoplay=1&rel=0&playsinline=1';
      iframe.title = v.title;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
    } else {
      var video = document.createElement('video');
      video.src = item.getAttribute('data-video');
      video.poster = src(v, v.poster || 'poster.webp');
      video.controls = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('controlslist', 'nodownload');   // hide the Download button
      video.preload = 'metadata';
      video.width = w;
      video.height = h;
      if (v.noUpscale) {                                    // low-res file: never show it bigger than it is
        frame.style.maxWidth = w + 'px';
        video.setAttribute('controlslist', 'nodownload nofullscreen');
        video.disablePictureInPicture = true;
      }
      video.setAttribute('aria-label', v.title);
      frame.appendChild(video);
      if (userOpened) S.quietPlay(video);          // sound needs a click; a shared link just shows the poster
    }
    return frame;
  }

  function clearMedia() {
    $$('video', V.media).forEach(function (v) { v.pause(); v.removeAttribute('src'); v.load(); });
    V.media.textContent = '';
  }

  function fill(item) {
    var v = byId[item.id];
    V.type.textContent = v.type || (item.classList.contains('vx-short') ? 'AI Video · Short-form' : '');
    V.title.textContent = v.title;
    V.year.textContent = v.year || '';
    V.text.textContent = '';
    V.text.appendChild(detail(v));
    clearMedia();
    V.media.appendChild(buildPlayer(item));
  }

  var viewer = S.viewer({
    dialog: dialog,
    swapFade: CONFIG.swapFade,
    swipeDistance: CONFIG.swipeDistance,
    list: function () { return allItems.filter(function (it) { return !it.hidden; }); },
    find: function (id) { var t = document.getElementById(id); return t && t.classList.contains('vx-item') ? t : null; },
    fill: fill,
    focusBack: function (item) { return $('.vx-card', item) || $('[data-inline-play]', item); },
    beforeOpen: function () {
      stopPreviews();
      if (inlineVideo && !inlineVideo.paused) inlineVideo.pause();
    },
    onStep: function () { userOpened = true; },
    afterClose: clearMedia
  });

  if (viewer) {
    $$('[data-open]').forEach(function (c) {
      c.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        userOpened = true;
        viewer.open(c.closest('.vx-item'), 'push');
      });
    });
    // links like "Watch the final video"
    $$('[data-open-id]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.getElementById(link.getAttribute('data-open-id'));
        if (!target) return;
        e.preventDefault();
        userOpened = true;
        viewer.open(target, 'push');
      });
    });
  }
})();
