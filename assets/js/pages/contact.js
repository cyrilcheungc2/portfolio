/*!
 * Cyril Cheung — Portfolio V2
 * CONTACT PAGE SCRIPT (contact.html)
 *
 * 1. Page: ready, header, back to top, reveals (shared code in assets/js/main.js)
 * 2. Cards: tap / click / keyboard turns a card over (hover is CSS on desktop)
 * 3. Copy the email address
 */
(function () {
  'use strict';

  var S = window.Site, $ = S.$, $$ = S.$$;

  /* =====================================================================
     1. PAGE
     ===================================================================== */
  S.pageReady(800);
  S.solidHeader();
  S.backToTop();
  S.reveal($$('[data-reveal]'), { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });


  /* =====================================================================
     2. CARDS — one open at a time on touch screens
     ===================================================================== */
  var items = $$('.ct-item');

  function setOpen(item, open, moveFocus) {
    item.classList.toggle('is-open', open);
    var front = $('[data-flip]', item);
    front.setAttribute('aria-expanded', String(open));
    if (open && moveFocus) {
      var first = $('.ct-back a, .ct-back button', item);
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 250);
    }
    if (!open && moveFocus) front.focus({ preventScroll: true });
  }

  items.forEach(function (item) {
    $('[data-flip]', item).addEventListener('click', function (e) {
      var open = !item.classList.contains('is-open');
      items.forEach(function (other) { if (other !== item) setOpen(other, false); });
      setOpen(item, open, e.detail === 0);          // detail 0 = keyboard (Enter / Space)
    });
    var unflip = $('[data-unflip]', item);
    if (unflip) unflip.addEventListener('click', function () { setOpen(item, false, true); });
  });

  // Esc or a tap outside the cards turns them back
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    items.forEach(function (item) { if (item.classList.contains('is-open')) setOpen(item, false, true); });
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('.ct-item')) return;
    items.forEach(function (item) { setOpen(item, false); });
  });


  /* =====================================================================
     3. COPY THE EMAIL ADDRESS
     ===================================================================== */
  var status = $('[data-copy-status]');

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {          // older browsers / opened from a file
      var t = document.createElement('textarea');
      t.value = text;
      t.setAttribute('readonly', '');
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      t.remove();
      ok ? resolve() : reject();
    });
  }

  $$('[data-copy]').forEach(function (btn) {
    var label = $('[data-copy-label]', btn);
    var original = label.textContent;
    btn.addEventListener('click', function () {
      copyText(btn.getAttribute('data-copy')).then(function () {
        btn.classList.add('is-done');
        label.textContent = 'Copied ✓';
        if (status) status.textContent = 'Email address copied.';
      }, function () {
        if (status) status.textContent = 'Could not copy — please select the address above.';
      });
      setTimeout(function () {
        btn.classList.remove('is-done');
        label.textContent = original;
        if (status) status.textContent = '';
      }, 2400);
    });
  });
})();
