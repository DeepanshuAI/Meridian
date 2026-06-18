/* ============================================================
   rooms.js — filtering + room detail modal
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Filtering ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var roomCards = document.querySelectorAll('.rooms-grid .room-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      var category = btn.dataset.filter;

      roomCards.forEach(function (card) {
        var match = category === 'all' || card.dataset.category === category;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Room detail modal ---------- */
  var overlay = document.querySelector('.room-modal-overlay');
  if (!overlay) return;
  var modal = overlay.querySelector('.room-modal');
  var closeBtn = overlay.querySelector('.room-modal-close');
  var lastFocused;

  var roomData = {
    deluxe: {
      name: 'Deluxe Ocean Room',
      img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000&q=80',
      price: '$420',
      desc: 'A serene 42m² retreat with floor-to-ceiling windows framing the Atlantic horizon, a reading nook, and a marble en-suite bath finished in honed travertine.',
      feats: ['42 m² / 452 sq ft', 'Sleeps 2 adults', 'Ocean-facing balcony', 'King bed, Egyptian linen', 'Rain shower & soaking tub', 'Nespresso & minibar']
    },
    suite: {
      name: 'Horizon Suite',
      img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&q=80',
      price: '$680',
      desc: 'A 68m² corner suite with a separate living area, walk-in dressing room, and a wraparound terrace built for slow mornings and longer sunsets.',
      feats: ['68 m² / 730 sq ft', 'Sleeps 3 adults', 'Wraparound terrace', 'Separate living room', 'Freestanding soaking tub', 'Private check-in']
    },
    penthouse: {
      name: 'Meridian Penthouse',
      img: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1000&q=80',
      price: '$1,450',
      desc: 'The hotel\'s signature residence — 140m² across the top floor, with a private plunge pool, dedicated butler, and uninterrupted views in three directions.',
      feats: ['140 m² / 1,507 sq ft', 'Sleeps 4 adults', 'Private plunge pool', 'Dedicated butler service', 'Two bedrooms', 'In-suite dining room']
    },
    family: {
      name: 'Family Garden Room',
      img: 'https://images.unsplash.com/photo-1591084728795-1149f32d9866?w=1000&q=80',
      price: '$510',
      desc: 'Two connecting rooms opening onto the lower garden terrace, designed for families who want space without sacrificing quiet.',
      feats: ['58 m² / 624 sq ft', 'Sleeps 4 (2 adults, 2 children)', 'Garden terrace access', 'Connecting room layout', 'Twin & king configuration', 'Kids welcome amenity']
    },
    classic: {
      name: 'Classic Courtyard Room',
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80',
      price: '$340',
      desc: 'Warm, quiet, and understated — overlooking the citrus courtyard, with the same considered details found throughout the house.',
      feats: ['34 m² / 366 sq ft', 'Sleeps 2 adults', 'Courtyard view', 'Queen bed, Egyptian linen', 'Walk-in rain shower', 'Nespresso & minibar']
    }
  };

  function openModal(key) {
    var data = roomData[key];
    if (!data) return;
    overlay.querySelector('.room-modal-media img').src = data.img;
    overlay.querySelector('.room-modal-media img').alt = data.name;
    overlay.querySelector('.room-modal-name').textContent = data.name;
    overlay.querySelector('.room-modal-price strong').textContent = data.price;
    overlay.querySelector('.room-modal-desc').textContent = data.desc;
    var featsList = overlay.querySelector('.room-modal-feats');
    featsList.innerHTML = data.feats.map(function (f) {
      return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' + f + '</li>';
    }).join('');
    var bookLink = overlay.querySelector('.room-modal-actions .btn-primary');
    if (bookLink) bookLink.href = 'booking.html?room=' + key;

    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    document.body.classList.add('drawer-open');
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-room]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(trigger.dataset.room);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });
})();
