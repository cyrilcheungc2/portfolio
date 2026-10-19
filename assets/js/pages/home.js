/*!
 * Cyril Cheung — Portfolio V2
 * HOME PAGE SCRIPT (index.html) — plain JavaScript, no libraries.
 *
 * 1. Settings (timings you may want to tweak)
 * 2. Helpers
 * 3. Load sequence (name → cards → typewriter → note)
 * 4. Typewriter
 * 5. Scroll transition + mouse parallax
 * 6. Hero looks at the cursor (video frames on a canvas)
 * 7. Scroll-to-explore button, back-to-top
 * 8. Selected work (built from assets/data/home.js)
 * 9. Scroll reveals (below the hero)
 * The mobile menu lives in assets/js/main.js.
 */
(function () {
  'use strict';

  /* =====================================================================
     1. SETTINGS
     ===================================================================== */
  var CONFIG = {
    // --- Load animation (ms, counted from when the hero image is ready) ---
    titleDelay: 120,        // CYRIL CHEUNG starts rising
    cardsStart: 650,        // first card appears
    cardStagger: 150,       // gap between cards, left → right (brief: 120–180)
    cueDelay: 1600,         // "Scroll to explore" fades in

    // --- Typewriter ---
    typeStart: 900,         // typing begins
    typeSpeed: 22,          // base ms per character (lower = faster)
    typeJitter: 22,         // random extra ms per character, feels human
    typePause: 170,         // extra pause after , . —
    caretLinger: 2600,      // caret blinks this long after typing, then fades
    noteDelay: 450,         // handwritten note appears this long after typing ends

    // --- Scroll transition ---
    // The hero is pinned for an extra 55% of a screen (see .work margin-top in home.css).
    scrollRange: 0.75,      // transition finishes after scrolling 0.75 × screen height
    maxDarken: 0.62,        // final hero darkness (brief: 0.55–0.65)

    // --- Scroll-to-explore button ---
    cueScrollDuration: 1500, // ms for the smooth scroll

    // --- Mouse parallax (desktop). Distances live in home.css (--parallax-*) ---
    parallaxEase: 0.08,     // 0.05 = floatier, 0.15 = snappier

    // --- Hero looks at the cursor. Frames + directions: assets/data/hero-gaze.js. See README §8. ---
    gaze: {
      enabled: true,
      introDelay: 500,      // ms after the page appears before he lifts his head
      introSpeed: 1,        // 1 = real speed of the video, 1.3 = a bit quicker
      reachX: 0.4,          // mouse this far from his face (× screen width) = full left / right
      reachY: 0.45,         // mouse this far from his face (× screen height) = full up / down
      centre: 0.07,         // mouse this close to his face = looks straight at you
      follow: 110,          // ms — how quickly he turns (70 = snappy, 180 = lazy)
      cut: 70,              // target more than this many video frames away → cut straight to it
      sticky: 0.06,         // stops flickering when the cursor rests between two directions
      feather: 28,          // px — soft edge where the moving area meets the still photo
      tapHold: 2500,        // phones: after a tap he looks there this long
      idleStart: 2500       // phones: ms after the intro before he first looks around
    }
  };


  /* =====================================================================
     2. HELPERS
     ===================================================================== */
  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { return 1 - (1 - t) * (1 - t); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  var hero = $('[data-hero]');
  var header = $('[data-header]');

  // Push timings into CSS
  root.style.setProperty('--title-delay', CONFIG.titleDelay + 'ms');
  root.style.setProperty('--cards-start', CONFIG.cardsStart + 'ms');
  root.style.setProperty('--card-stagger', CONFIG.cardStagger + 'ms');
  root.style.setProperty('--cue-delay', CONFIG.cueDelay + 'ms');
  root.style.setProperty('--max-dim', String(CONFIG.maxDarken));


  /* =====================================================================
     3. LOAD SEQUENCE
     ===================================================================== */
  function imageReady(img) {
    if (img.complete && img.naturalWidth) {
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    }
    return new Promise(function (resolve) {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  }

  // Hero still photo (= first frame of the video)
  function heroImageReady() {
    return Promise.all($$('.hero-img').map(imageReady));
  }

  function fontsReady() {
    return document.fonts && document.fonts.ready ? document.fonts.ready.catch(function () {}) : Promise.resolve();
  }

  var typewriter = buildTypewriter($('[data-typewriter]'));
  var note = $('[data-note]');

  function start() {
    requestAnimationFrame(function () {
      root.classList.add('is-ready');

      if (reducedMotion) {
        if (typewriter) showAllTyped(typewriter);
        if (note) note.classList.add('is-shown');
        return;
      }

      if (gaze) setTimeout(gaze.begin, CONFIG.gaze.introDelay);

      setTimeout(function () {
        if (!typewriter) return;
        runTypewriter(typewriter, function () {
          if (note) setTimeout(function () { note.classList.add('is-shown'); }, CONFIG.noteDelay);
        });
      }, CONFIG.typeStart);

    });
  }

  // Start when the hero image (and fonts) are ready — never wait more than 1.6s
  Promise.race([Promise.all([heroImageReady(), fontsReady()]), wait(1600)]).then(start);


  /* =====================================================================
     4. TYPEWRITER
     Splits the sentence into characters (wrapped by word so line breaks
     never jump). The full sentence stays available to screen readers.
     ===================================================================== */
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

    var srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = parts.map(function (p) { return p.text; }).join('');

    var visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');

    var chars = [];
    parts.forEach(function (part) {
      var seg = document.createElement(part.strong ? 'strong' : 'span');
      part.text.split(/(\s+)/).forEach(function (token) {
        if (!token) return;
        var isSpace = /^\s+$/.test(token);
        var holder = seg;
        if (!isSpace) {
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
    el.appendChild(srText);
    el.appendChild(visual);

    var caret = document.createElement('span');
    caret.className = 'tw-caret';

    return { chars: chars, caret: caret };
  }

  function showAllTyped(tw) {
    tw.chars.forEach(function (c) { c.classList.add('is-on'); });
  }

  function runTypewriter(tw, onDone) {
    var i = 0;
    function step() {
      var c = tw.chars[i];
      c.classList.add('is-on');
      c.appendChild(tw.caret);
      i++;
      if (i >= tw.chars.length) {
        tw.caret.classList.add('is-idle');
        setTimeout(function () { tw.caret.classList.add('is-gone'); }, CONFIG.caretLinger);
        if (onDone) onDone();
        return;
      }
      var ch = c.textContent;
      var delay = CONFIG.typeSpeed + Math.random() * CONFIG.typeJitter;
      if (/[,.;:!?—–]/.test(ch)) delay += CONFIG.typePause;
      else if (ch === ' ') delay *= 0.6;
      setTimeout(step, delay);
    }
    step();
  }


  /* =====================================================================
     5. SCROLL TRANSITION + MOUSE PARALLAX
     home.js only writes a few numbers onto the hero (--p, --e, --mx, --my).
     All the actual movement is defined in home.css.
     ===================================================================== */
  var state = { p: -1, mx: 0, my: 0, tx: 0, ty: 0, mouseX: 0, mouseY: 0, mouseIn: false };
  var ticking = false;
  var parallaxOn = finePointer && !reducedMotion;
  var gaze = null;   // set up in section 6
  var workEl = $('#work');
  var workTop = 0;   // where the next section starts (cached)
  var headerH = 0;

  function measure() {
    workTop = workEl ? workEl.offsetTop : window.innerHeight * 1.5;
    headerH = header.offsetHeight;
  }
  measure();
  window.addEventListener('load', function () { measure(); requestFrame(); });

  function requestFrame() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  }

  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    var y = window.pageYOffset || root.scrollTop;
    var face = gaze && y < workTop ? gaze.face() : null;   // read layout before writing styles

    // Scroll progress through the hero transition
    var p = clamp(y / (vh * CONFIG.scrollRange), 0, 1);
    if (p !== state.p) {
      state.p = p;
      hero.style.setProperty('--p', p.toFixed(4));
      hero.style.setProperty('--e', easeOut(p).toFixed(4));  // responds straight away, settles softly
    }
    header.classList.toggle('is-solid', y > workTop - headerH);
    hero.classList.toggle('is-covered', y > workTop + 2);

    var again = false;
    if (parallaxOn && y < workTop) {
      state.mx += (state.tx - state.mx) * CONFIG.parallaxEase;
      state.my += (state.ty - state.my) * CONFIG.parallaxEase;
      if (Math.abs(state.tx - state.mx) > 0.0005 || Math.abs(state.ty - state.my) > 0.0005) {
        again = true;
      } else {
        state.mx = state.tx;
        state.my = state.ty;
      }
      hero.style.setProperty('--mx', state.mx.toFixed(4));
      hero.style.setProperty('--my', state.my.toFixed(4));
    }

    if (face) {
      if (gaze.step(face, state.mouseX, state.mouseY, state.mouseIn)) again = true;
    }

    if (again) requestFrame();
  }

  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', function () { measure(); requestFrame(); });

  if (parallaxOn) {
    window.addEventListener('mousemove', function (e) {
      state.tx = (e.clientX / window.innerWidth) * 2 - 1;
      state.ty = (e.clientY / window.innerHeight) * 2 - 1;
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      state.mouseIn = true;
      requestFrame();
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget) {           // pointer left the window → look back out of the window
        state.tx = 0;
        state.ty = 0;
        state.mouseIn = false;
        requestFrame();
      }
    });
  }

  requestFrame();


  /* =====================================================================
     6. HERO LOOKS AT THE CURSOR
     Not CSS movement and not video scrubbing (no video.currentTime).
     The video was cut into WebP frames (assets/images/home/gaze/), which are
     preloaded. From the cursor we pick a target frame (the one whose gaze
     direction matches best), then step frame by frame from the current frame
     towards it — only ever drawing ONE real frame, never two mixed together,
     so there is no ghosting:
       video → WebP frames → preload → canvas → cursor → targetFrame → step there
     If the target is far away along the video (the turn between them was never
     filmed), we cut straight to it instead.
     Sequence: still photo (chin on hand) → intro (he lifts his head and looks
     at you) → follows the mouse. Phones: looks around by himself, a tap makes
     him look at that spot. Reduced motion: the still photo only.
     ===================================================================== */
  gaze = setupGaze();

  function setupGaze() {
    var cfg = CONFIG.gaze;
    var G = window.HERO_GAZE;
    var canvas = $('[data-gaze]');
    if (!cfg.enabled || !G || !canvas || !canvas.getContext || reducedMotion) return null;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    var V = G.video, C = G.crop, step = V.step || 1;

    // Big desktop screens get the 1080p frames, everything else the 720p set
    // (phones, small laptops, data-saver mode). Positions in hero-gaze.js are
    // always in 720p video pixels; the HD set is the same crop × hd.scale.
    var conn = navigator.connection || {};
    var screenPx = Math.max(window.innerWidth, window.innerHeight * V.w / V.h) * (window.devicePixelRatio || 1);
    var hd = !!(G.hd && finePointer && !conn.saveData && screenPx >= G.hd.minScreen);
    var folder, scale, CW, CH;

    // Canvas covers exactly the moving area of the photo
    canvas.style.left = (C.x / V.w * 100) + '%';
    canvas.style.top = (C.y / V.h * 100) + '%';
    canvas.style.width = (C.w / V.w * 100) + '%';
    canvas.style.height = (C.h / V.h * 100) + '%';

    // Soft edge where the canvas meets the still photo (only on sides that are
    // inside the photo). Done once with a CSS mask, so it costs nothing per frame.
    (function () {
      var fx = (cfg.feather / C.w * 100).toFixed(2) + '%';
      var fy = (cfg.feather / C.h * 100).toFixed(2) + '%';
      var l = C.x > 0 ? 'transparent 0, #000 ' + fx : '#000 0';
      var r = C.x + C.w < V.w ? '#000 calc(100% - ' + fx + '), transparent 100%' : '#000 100%';
      var t = C.y > 0 ? 'transparent 0, #000 ' + fy : '#000 0';
      var b = C.y + C.h < V.h ? '#000 calc(100% - ' + fy + '), transparent 100%' : '#000 100%';
      var m = 'linear-gradient(to right, ' + l + ', ' + r + '), linear-gradient(to bottom, ' + t + ', ' + b + ')';
      canvas.style.webkitMaskImage = m;
      canvas.style.maskImage = m;
      canvas.style.webkitMaskComposite = 'source-in';
      canvas.style.maskComposite = 'intersect';
    })();

    function useSet(big) {
      hd = big;
      folder = big ? G.hd.folder : G.folder;
      scale = big ? G.hd.scale : 1;
      CW = Math.round(C.w * scale);
      CH = Math.round(C.h * scale);
      canvas.width = CW;
      canvas.height = CH;
    }
    useSet(hd);

    // --- Frames -----------------------------------------------------------
    // Every frame is downloaded once (small, compressed). Only the frames needed
    // right now — around the current one and on the way to the target — are kept
    // decoded (ImageBitmap), because drawing a still-compressed image makes the
    // browser decode it again on every draw, which is what made it stutter.
    var frames = {};   // frame number → { f, ok (downloaded), src (Blob or Image) }
    for (var f = 0; f <= V.last; f += step) frames[f] = { f: f, ok: false, src: null };
    function snap(n) { return clamp(Math.round(n / step) * step, 0, V.last); }

    // Gaze direction of every frame that may be picked as a target
    // (straight lines between the key frames in hero-gaze.js)
    var cands = [];
    var segment = [];
    G.keys.concat([null]).forEach(function (k) {
      if (k) { segment.push(k); return; }
      for (var i = 0; i < segment.length - 1; i++) {
        var a = segment[i], b = segment[i + 1];
        for (var n = a[0]; n < b[0] || (i === segment.length - 2 && n === b[0]); n += step) {
          var t = (n - a[0]) / (b[0] - a[0]);
          cands.push({ f: n, x: a[1] + (b[1] - a[1]) * t, y: a[2] + (b[2] - a[2]) * t });
        }
      }
      segment = [];
    });

    // Download order: intro first, then the rest coarse → fine
    var order = [], seen = {};
    function queue(n) { n = snap(n); if (!seen[n]) { seen[n] = true; order.push(n); } }
    for (f = G.intro.from; f <= G.intro.to; f += step) queue(f);
    [16, 8, 4, 2, 1].forEach(function (gap) {
      for (var n = 0; n <= V.last; n += gap * step) queue(n);
    });

    var bitmaps = typeof window.createImageBitmap === 'function' && !!window.Map;
    // Opened straight from disk (file://) the browser won't fetch() files,
    // so there we load <img>s and decode those instead.
    var viaFetch = bitmaps && !!window.fetch && /^https?:/.test(location.protocol);
    function url(n) { return folder + 'f' + ('00' + n).slice(-3) + '.' + (G.ext || 'webp'); }

    // The first frame downloads on its own. If it fails:
    //  · HD set → fall back to the 720p set (e.g. the gaze-hd folder wasn't uploaded)
    //  · 720p set → stop; the still photo stays (e.g. very old Safari can't show AVIF)
    var next = 0, active = 0, firstOk = false, broken = false, gen = 0;
    function failed(src) {
      if (firstOk) { loadMore(); return; }
      if (window.console) console.warn('Hero gaze: cannot load ' + src);
      if (hd) { useSet(false); gen++; next = 0; loadMore(); }
      else broken = true;
    }
    function got(fr, src) {
      fr.src = src; fr.ok = true; firstOk = true;
      active--; loadMore(); requestFrame();
    }
    function loadMore() {
      while (!broken && active < (firstOk ? 6 : 1) && next < order.length) {
        (function (fr, g) {
          active++;
          var u = url(fr.f);
          if (viaFetch) {
            fetch(u).then(function (r) {
              if (!r.ok) throw new Error(r.status);
              return r.blob();
            }).then(function (blob) {
              if (g !== gen) { active--; return; }
              // first frame: make sure this browser can really decode the format
              if (firstOk) { got(fr, blob); return; }
              createImageBitmap(blob).then(function (bm) { keep(fr.f, bm); got(fr, blob); },
                                           function () { active--; failed(u); });
            }).catch(function () { if (g === gen) { active--; failed(u); } else active--; });
          } else {
            var img = new Image();
            img.decoding = 'async';
            img.onload = function () {
              if (g !== gen) { active--; return; }
              if (!bitmaps || firstOk) { got(fr, img); return; }
              createImageBitmap(img).then(function (bm) { keep(fr.f, bm); got(fr, img); },
                                          function () { bitmaps = false; got(fr, img); });
            };
            img.onerror = function () { active--; if (g === gen) failed(u); };
            img.src = u;
          }
        })(frames[order[next++]], gen);
      }
    }
    loadMore();

    function loaded(n) { var fr = frames[n]; return !!(fr && fr.ok); }
    function allLoaded(a, b) {
      for (var n = snap(a); n <= b; n += step) if (!loaded(n)) return false;
      return true;
    }

    // --- Decoded frames: a small "most recently used" cache -----------------
    var CAP = hd ? 70 : (finePointer ? 110 : 60);   // ≈ 240 MB (HD) / 170 MB / 90 MB (phones)
    var cache = window.Map ? new Map() : null;     // frame → ImageBitmap
    var decoding = {}, decodingCount = 0, wanted = [];
    function ready(n) { return bitmaps ? cache.has(n) : loaded(n); }
    function keep(n, bm) {
      if (cache.has(n)) cache.get(n).close && cache.get(n).close();
      cache.delete(n);
      cache.set(n, bm);
      if (cache.size > CAP) {
        var it = cache.keys(), k;
        while (cache.size > CAP && !(k = it.next()).done) {
          if (k.value === drawn || wanted.indexOf(k.value) > -1) continue;
          var old = cache.get(k.value);
          if (old.close) old.close();
          cache.delete(k.value);
        }
      }
    }
    function touch(n) { var bm = cache.get(n); cache.delete(n); cache.set(n, bm); }
    // Ask for these frames to be decoded, most important first
    function want(list) {
      if (!bitmaps) return;
      wanted = list.filter(function (n) { return loaded(n) && !cache.has(n) && !decoding[n]; }).slice(0, 48);
      pump();
    }
    function pump() {
      while (decodingCount < 4 && wanted.length) {
        (function (n) {
          decoding[n] = true; decodingCount++;
          createImageBitmap(frames[n].src).then(function (bm) {
            decoding[n] = false; decodingCount--;
            keep(n, bm); pump(); requestFrame();
          }, function () { decoding[n] = false; decodingCount--; pump(); });
        })(wanted.shift());
      }
    }
    // Frames from a towards b (inclusive), in order
    function path(a, b, max) {
      var out = [], s = b >= a ? step : -step;
      for (var n = snap(a); out.length < max; n += s) {
        out.push(n);
        if (n === snap(b) || n <= 0 || n >= V.last) break;
      }
      return out;
    }

    // --- Drawing: always exactly one real, already-decoded frame -------------
    var drawn = -1, live = false;
    function show(pos, towards) {
      var n = snap(pos);
      if (!ready(n)) {
        // not decoded yet → use a ready frame just before it (a few frames back
        // towards the last drawn one); if there's none, keep the current picture
        var from = drawn >= 0 ? drawn : n, found = -1;
        var p = path(n, from, 6);
        for (var i = 0; i < p.length && found < 0; i++) if (ready(p[i])) found = p[i];
        want(path(n, towards === undefined ? n : towards, 48));
        if (found < 0) return;
        n = found;
      }
      if (n === drawn) return;
      drawn = n;
      canvas.setAttribute('data-frame', n);   // handy for checking
      var src = bitmaps ? cache.get(n) : frames[n].src;
      if (bitmaps) touch(n);
      ctx.clearRect(0, 0, CW, CH);
      ctx.drawImage(src, 0, 0, CW, CH);
      if (!live) { live = true; canvas.classList.add('is-live'); }
    }

    // --- State --------------------------------------------------------------
    // mode: 'still' → 'intro' → 'follow' (desktop) / 'rest' ⇄ 'play' (phones)
    var mode = 'still';
    var pos = 0;                    // current frame (may be between two frames while moving)
    var playTo = 0, playSpeed = 1, playDone = null;
    var target = null;              // target frame in follow mode
    var gx = 0, gy = 0;             // smoothed cursor direction
    var lastCut = 0;
    var lastTime = 0;
    var timer = 0;
    var tapUntil = 0, tapX = 0, tapY = 0;

    function playFrom(from, to, speed, onDone) {
      mode = 'play';
      pos = from; playTo = to; playSpeed = speed; playDone = onDone;
      requestFrame();
    }

    function toFollow() {
      target = null;
      mode = 'follow';
      requestFrame();
    }

    // Phones: rest, look around once, rest again …
    function rest(ms) {
      mode = 'rest';
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (!allLoaded(G.idle.from, G.idle.to)) { rest(1500); return; }
        playFrom(G.idle.from, G.idle.to, 1, function () { rest(G.idle.pause); });
      }, ms);
    }

    function afterIntro() {
      if (finePointer) toFollow();
      else rest(cfg.idleStart);
    }

    // Phones: a tap on the hero makes him look at that spot for a moment
    if (!finePointer) {
      hero.addEventListener('pointerdown', function (e) {
        if (mode === 'still' || mode === 'intro') return;
        clearTimeout(timer);
        if (mode !== 'follow') toFollow();
        tapX = e.clientX; tapY = e.clientY;
        tapUntil = performance.now() + cfg.tapHold;
        requestFrame();
      });
    }

    function begin() {
      if (mode !== 'still') return;
      var tries = 0;
      (function waitIntro() {
        if (allLoaded(G.intro.from, G.intro.to)) {
          show(G.intro.from);
          playFrom(G.intro.from, G.intro.to, cfg.introSpeed, afterIntro);
          mode = 'intro';
        } else if (++tries < 40) {
          setTimeout(waitIntro, 100);
        } else if (loaded(snap(G.intro.to))) {   // slow connection: skip the intro
          pos = G.intro.to;
          show(pos);
          afterIntro();
        }
      })();
    }

    // Best target frame for a direction. Frames that look the same way
    // (e.g. the two "looking at you" frames) → take the one nearest in the video.
    function pickTarget(x, y) {
      var best = null, bd = 1e9;
      var i, c, d;
      for (i = 0; i < cands.length; i++) {
        c = cands[i];
        d = Math.sqrt((c.x - x) * (c.x - x) + (c.y - y) * (c.y - y));
        c.d = d;
        if (d < bd) { bd = d; best = c; }
      }
      var near = best;
      for (i = 0; i < cands.length; i++) {
        c = cands[i];
        if (c.d <= bd + 0.02 && Math.abs(c.f - pos) < Math.abs(near.f - pos)) near = c;
      }
      // a little stickiness, so a cursor resting on a boundary never flickers
      if (target !== null) {
        for (i = 0; i < cands.length; i++) {
          if (cands[i].f === target && cands[i].d <= bd + cfg.sticky) return target;
        }
      }
      return near.f;
    }

    return {
      begin: begin,

      // Where his face is on screen right now
      face: function () {
        var r = canvas.getBoundingClientRect();
        return {
          x: r.left + (G.face.x - C.x) / C.w * r.width,
          y: r.top + (G.face.y - C.y) / C.h * r.height
        };
      },

      // Called from the animation loop. Returns true while still moving.
      step: function (face, mouseX, mouseY, mouseIn) {
        var now = performance.now();
        var dt = lastTime ? Math.min(64, now - lastTime) : 16;
        lastTime = now;

        // Intro / look-around: play the real frames in order
        // (waits a moment if the next frames aren't decoded yet, instead of skipping)
        if (mode === 'play' || mode === 'intro') {
          var np = Math.min(playTo, pos + dt / 1000 * V.fps * playSpeed);
          var ahead = path(pos, np, 400);
          for (var i = 1; i < ahead.length; i++) {
            if (!ready(ahead[i])) { np = Math.min(np, ahead[i - 1] + step * 0.99); break; }
          }
          pos = np;
          want(path(pos, playTo, 32));
          show(pos);
          if (pos >= playTo) {
            var cb = playDone; playDone = null;
            if (cb) cb();
            return mode === 'follow';
          }
          return true;
        }
        if (mode !== 'follow') { lastTime = 0; return false; }

        // Direction from his face to the cursor (or a tap on phones)
        var tx = 0, ty = 0;
        var px = mouseX, py = mouseY, on = mouseIn;
        if (!finePointer) { on = now < tapUntil; px = tapX; py = tapY; }
        if (on) {
          var dx = (px - face.x) / (window.innerWidth * cfg.reachX);
          var dy = (py - face.y) / (window.innerHeight * cfg.reachY);
          var len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0.0001) {
            var s = clamp((len - cfg.centre) / (0.45 - cfg.centre), 0, 1);
            s = s * s * (3 - 2 * s);            // quickly out to the full turn, gently near the face
            tx = dx / len * s;
            ty = dy / len * s;
          }
        }
        var k0 = 1 - Math.exp(-dt / 40);        // tiny smoothing so a shaky hand doesn't jitter
        gx += (tx - gx) * k0;
        gy += (ty - gy) * k0;

        target = pickTarget(gx, gy);

        // Walk frame by frame towards the target — or cut if it was never filmed in between
        var diff = target - pos;
        if (Math.abs(diff) > cfg.cut && now - lastCut > 160) {
          pos = target;
          lastCut = now;
        } else {
          pos += diff * (1 - Math.exp(-dt / cfg.follow));
          if (Math.abs(target - pos) < 0.5) pos = target;
        }
        want(path(pos, target, 48));
        show(pos, target);

        var moving = pos !== target || Math.abs(tx - gx) > 0.003 || Math.abs(ty - gy) > 0.003;

        // Phones: tap is over and he's looking ahead again → back to looking around
        if (!finePointer && !on && !moving) {
          rest(G.idle.pause);
          return false;
        }
        return moving || (!finePointer && on);
      }
    };
  }


  /* =====================================================================
     7. SCROLL-TO-EXPLORE + BACK TO TOP
     ===================================================================== */
  var scrollAnim = null;

  function smoothScrollTo(targetY, duration, onDone) {
    if (scrollAnim) cancelAnimationFrame(scrollAnim);
    if (reducedMotion) {
      window.scrollTo(0, targetY);
      if (onDone) onDone();
      return;
    }
    var startY = window.pageYOffset;
    var dist = targetY - startY;
    var t0 = null;

    function cancel() {
      if (scrollAnim) cancelAnimationFrame(scrollAnim);
      scrollAnim = null;
      removeCancel();
    }
    function removeCancel() {
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
    }
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', cancel);

    function tick(now) {
      if (t0 === null) t0 = now;
      var t = clamp((now - t0) / duration, 0, 1);
      window.scrollTo(0, startY + dist * easeInOut(t));
      if (t < 1) {
        scrollAnim = requestAnimationFrame(tick);
      } else {
        scrollAnim = null;
        removeCancel();
        if (onDone) onDone();
      }
    }
    scrollAnim = requestAnimationFrame(tick);
  }

  var cue = $('[data-scroll-cue]');
  var workSection = $('#work');
  if (cue && workSection) {
    cue.addEventListener('click', function () {
      var targetY = workSection.getBoundingClientRect().top + window.pageYOffset;
      smoothScrollTo(targetY, CONFIG.cueScrollDuration, function () {
        workSection.focus({ preventScroll: true });
      });
    });
  }

  var toTop = $('[data-to-top]');
  if (toTop) {
    toTop.addEventListener('click', function (e) {
      e.preventDefault();
      smoothScrollTo(0, 1200);
    });
  }


  /* =====================================================================
     8. SELECTED WORK — built from assets/data/home.js
     Title / category / year come from the Design or Video data,
     so renaming a project there updates the Home page too.
     ===================================================================== */
  (function buildWork() {
    var box = $('[data-work-grid]');
    var S = window.Site;
    if (!box || !S) return;
    if (!window.HOME_PICKS) { S.dataError(box, 'assets/data/home.js'); return; }

    function lookup(pick) {
      if (pick.from === 'video') {
        var W = window.VIDEO_WORK || {};
        var all = [W.featured].concat(W.grid || [], W.shorts || []);
        var v = all.filter(function (x) { return x && x.id === pick.id; })[0];
        return { link: 'ai-video.html#' + pick.id, item: v };
      }
      var p = (window.DESIGN_PROJECTS || []).filter(function (x) { return x.id === pick.id; })[0];
      return { link: 'design.html#' + pick.id, item: p };
    }

    window.HOME_PICKS.forEach(function (pick) {
      var found = lookup(pick);
      var it = found.item || {};
      var title = pick.title || it.title || pick.id;
      var info = S.parseImage(pick.image || '');

      var art = S.el('article', 'work-item work-item--' + pick.slot);
      art.setAttribute('data-reveal', '');
      var a = S.el('a');
      a.href = pick.link || found.link;
      var fig = S.el('figure', 'work-media');
      fig.appendChild(S.img('assets/work/home/' + info.file, info, title));
      var meta = S.el('div', 'work-meta');
      meta.appendChild(S.el('span', 'work-cat', pick.type || it.type || ''));
      meta.appendChild(S.el('h3', 'work-title', title));
      meta.appendChild(S.el('span', 'work-year', pick.year || it.year || ''));
      a.appendChild(fig);
      a.appendChild(meta);
      art.appendChild(a);
      box.appendChild(art);
    });
  })();


  /* =====================================================================
     9. SCROLL REVEALS (below the hero)
     ===================================================================== */
  var revealEls = $$('[data-reveal]');
  var statementLines = $$('.statement-line');

  if (!('IntersectionObserver' in window) || reducedMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
    statementLines.forEach(function (el) { el.classList.add('is-lit'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          revealIO.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { revealIO.observe(el); });

    // "Ideas first. / Then design. / Make it move." light up as they pass
    var lineIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-lit');
          lineIO.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -28% 0px', threshold: 1 });
    statementLines.forEach(function (el) { lineIO.observe(el); });
  }
})();
