/* ============================================================
   gallery.js — masonry filter + lightbox
   ============================================================ */
(function () {
  'use strict';

  var filterBtns = document.querySelectorAll('.filter-btn');
  var items = Array.prototype.slice.call(document.querySelectorAll('.masonry-item'));

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var cat = btn.dataset.filter;
      items.forEach(function (item) {
        item.classList.toggle('is-hidden', !(cat === 'all' || item.dataset.category === cat));
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  var lbImg = lightbox.querySelector('img');
  var lbCaption = lightbox.querySelector('.lightbox-caption');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var prevBtn = lightbox.querySelector('.lightbox-prev');
  var nextBtn = lightbox.querySelector('.lightbox-next');
  var visibleItems = [];
  var index = 0;
  var lastFocused;

  function getVisible() {
    return items.filter(function (item) { return !item.classList.contains('is-hidden'); });
  }

  function show(i) {
    visibleItems = getVisible();
    index = (i + visibleItems.length) % visibleItems.length;
    var item = visibleItems[index];
    var fullSrc = item.dataset.full || item.querySelector('img').src;
    lbImg.src = fullSrc;
    lbImg.alt = item.querySelector('img').alt;
    lbCaption.textContent = item.querySelector('img').alt;
  }

  function open(item) {
    visibleItems = getVisible();
    index = visibleItems.indexOf(item);
    show(index);
    lastFocused = document.activeElement;
    lightbox.classList.add('is-open');
    document.body.classList.add('drawer-open');
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    if (lastFocused) lastFocused.focus();
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () { open(item); });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(item); }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(index - 1); });
  nextBtn.addEventListener('click', function () { show(index + 1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
