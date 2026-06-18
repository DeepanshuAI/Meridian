/* ============================================================
   booking.js — multi-step booking flow
   ============================================================ */
(function () {
  'use strict';
  var form = document.getElementById('booking-form');
  if (!form) return;

  var steps = ['dates', 'room', 'guest', 'review'];
  var stepIndicators = document.querySelectorAll('.booking-step');
  var sections = document.querySelectorAll('.booking-form-section');
  var currentStep = 0;

  var rooms = {
    classic: { name: 'Classic Courtyard Room', price: 340, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80', desc: 'Courtyard view · Queen bed · Sleeps 2' },
    deluxe: { name: 'Deluxe Ocean Room', price: 420, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300&q=80', desc: 'Ocean view · King bed · Sleeps 2' },
    family: { name: 'Family Garden Room', price: 510, img: 'https://images.unsplash.com/photo-1591084728795-1149f32d9866?w=300&q=80', desc: 'Garden terrace · Connecting rooms · Sleeps 4' },
    suite: { name: 'Horizon Suite', price: 680, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&q=80', desc: 'Corner suite · Wraparound terrace · Sleeps 3' },
    penthouse: { name: 'Meridian Penthouse', price: 1450, img: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=300&q=80', desc: 'Private plunge pool · Two bedrooms · Sleeps 4' }
  };

  var state = { room: null, checkin: '', checkout: '', guests: 2 };

  /* ---------- Populate from query params ---------- */
  var qp = new URLSearchParams(window.location.search);
  if (qp.get('checkin')) form.elements.checkin.value = qp.get('checkin');
  if (qp.get('checkout')) form.elements.checkout.value = qp.get('checkout');
  if (qp.get('guests')) form.elements.guests_select.value = qp.get('guests');
  if (qp.get('room') && rooms[qp.get('room')]) {
    state.room = qp.get('room');
  }

  /* ---------- Render room selection cards ---------- */
  var roomListEl = document.querySelector('.room-select-list');
  function renderRoomList() {
    roomListEl.innerHTML = Object.keys(rooms).map(function (key) {
      var r = rooms[key];
      var selected = state.room === key ? ' is-selected' : '';
      return '<div class="room-select-card' + selected + '" data-room="' + key + '" role="radio" aria-checked="' + (state.room === key) + '" tabindex="0">' +
        '<img src="' + r.img + '" alt="' + r.name + '">' +
        '<div class="room-select-info"><h4>' + r.name + '</h4><p>' + r.desc + '</p></div>' +
        '<div class="room-select-price"><strong>$' + r.price + '</strong><span>per night</span></div>' +
        '<div class="room-select-radio"></div></div>';
    }).join('');

    roomListEl.querySelectorAll('.room-select-card').forEach(function (card) {
      card.addEventListener('click', function () { selectRoom(card.dataset.room); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRoom(card.dataset.room); }
      });
    });
  }

  function selectRoom(key) {
    state.room = key;
    roomListEl.querySelectorAll('.room-select-card').forEach(function (card) {
      var isSel = card.dataset.room === key;
      card.classList.toggle('is-selected', isSel);
      card.setAttribute('aria-checked', isSel);
    });
    showError('room-error', '');
    updateSummary();
  }
  renderRoomList();

  /* ---------- Step navigation ---------- */
  function goToStep(i) {
    currentStep = i;
    sections.forEach(function (sec, idx) { sec.classList.toggle('is-active', idx === i); });
    stepIndicators.forEach(function (ind, idx) {
      ind.classList.remove('is-active', 'is-done');
      if (idx < i) ind.classList.add('is-done');
      if (idx === i) ind.classList.add('is-active');
    });
    document.querySelector('.booking-form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showError(id, msg) {
    var el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function nightsBetween(inDate, outDate) {
    var d1 = new Date(inDate), d2 = new Date(outDate);
    var diff = (d2 - d1) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  }

  function validateStep(i) {
    if (steps[i] === 'dates') {
      var checkin = form.elements.checkin.value;
      var checkout = form.elements.checkout.value;
      var ok = true;
      if (!checkin) { showError('checkin-error', 'Please choose a check-in date.'); ok = false; }
      else showError('checkin-error', '');
      if (!checkout) { showError('checkout-error', 'Please choose a check-out date.'); ok = false; }
      else if (checkin && nightsBetween(checkin, checkout) <= 0) { showError('checkout-error', 'Check-out must be after check-in.'); ok = false; }
      else showError('checkout-error', '');
      if (ok) { state.checkin = checkin; state.checkout = checkout; state.guests = parseInt(form.elements.guests_select.value, 10); }
      return ok;
    }
    if (steps[i] === 'room') {
      if (!state.room) { showError('room-error', 'Please select a room to continue.'); return false; }
      showError('room-error', '');
      return true;
    }
    if (steps[i] === 'guest') {
      var ok2 = true;
      ['full_name', 'email', 'phone'].forEach(function (name) {
        var field = form.elements[name];
        var val = field.value.trim();
        var msg = '';
        if (name === 'full_name' && val.length < 2) msg = 'Please enter your full name.';
        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Please enter a valid email address.';
        if (name === 'phone' && !/^[+\d][\d\s().-]{6,}$/.test(val)) msg = 'Please enter a valid phone number.';
        showError(name + '-error', msg);
        if (msg) ok2 = false;
      });
      return ok2;
    }
    return true;
  }

  document.querySelectorAll('[data-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (validateStep(currentStep)) {
        updateSummary();
        if (currentStep === steps.length - 1) return;
        goToStep(currentStep + 1);
        if (steps[currentStep] === 'review') renderReview();
      }
    });
  });
  document.querySelectorAll('[data-prev]').forEach(function (btn) {
    btn.addEventListener('click', function () { goToStep(currentStep - 1); });
  });

  /* ---------- Guest counter ---------- */
  var guestMinus = document.querySelector('[data-guest-minus]');
  var guestPlus = document.querySelector('[data-guest-plus]');
  var guestVal = document.querySelector('.guest-counter-val');
  if (guestMinus && guestPlus) {
    guestMinus.addEventListener('click', function () {
      state.guests = Math.max(1, state.guests - 1);
      guestVal.textContent = state.guests;
      updateSummary();
    });
    guestPlus.addEventListener('click', function () {
      state.guests = Math.min(8, state.guests + 1);
      guestVal.textContent = state.guests;
      updateSummary();
    });
  }

  /* ---------- Live summary ---------- */
  function updateSummary() {
    var panel = document.querySelector('.summary-panel');
    var checkin = form.elements.checkin.value;
    var checkout = form.elements.checkout.value;
    var nights = nightsBetween(checkin, checkout);

    if (!state.room && !checkin) {
      panel.querySelector('.summary-body').innerHTML = '<p class="summary-empty">Your reservation details will appear here as you go.</p>';
      return;
    }

    var room = rooms[state.room];
    var nightly = room ? room.price : 0;
    var subtotal = nightly * nights;
    var taxes = Math.round(subtotal * 0.12);
    var total = subtotal + taxes;

    var html = '';
    if (room) html += '<div class="summary-row"><span>Room</span><span>' + room.name + '</span></div>';
    if (checkin) html += '<div class="summary-row"><span>Check-in</span><span>' + formatDate(checkin) + '</span></div>';
    if (checkout) html += '<div class="summary-row"><span>Check-out</span><span>' + formatDate(checkout) + '</span></div>';
    if (nights) html += '<div class="summary-row"><span>Nights</span><span>' + nights + '</span></div>';
    html += '<div class="summary-row"><span>Guests</span><span>' + state.guests + '</span></div>';
    if (room && nights) {
      html += '<div class="summary-row"><span>Room rate</span><span>$' + nightly + ' × ' + nights + '</span></div>';
      html += '<div class="summary-row"><span>Taxes & fees (12%)</span><span>$' + taxes.toLocaleString() + '</span></div>';
      html += '<div class="summary-total"><span>Total</span><span>$' + total.toLocaleString() + '</span></div>';
    }
    panel.querySelector('.summary-body').innerHTML = html;
  }

  function formatDate(str) {
    var d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function renderReview() {
    var room = rooms[state.room];
    var nights = nightsBetween(form.elements.checkin.value, form.elements.checkout.value);
    var reviewEl = document.querySelector('.review-details');
    reviewEl.innerHTML =
      '<div class="summary-row"><span>Room</span><span>' + room.name + '</span></div>' +
      '<div class="summary-row"><span>Check-in</span><span>' + formatDate(form.elements.checkin.value) + '</span></div>' +
      '<div class="summary-row"><span>Check-out</span><span>' + formatDate(form.elements.checkout.value) + '</span></div>' +
      '<div class="summary-row"><span>Nights</span><span>' + nights + '</span></div>' +
      '<div class="summary-row"><span>Guests</span><span>' + state.guests + '</span></div>' +
      '<div class="summary-row"><span>Guest name</span><span>' + form.elements.full_name.value + '</span></div>' +
      '<div class="summary-row"><span>Email</span><span>' + form.elements.email.value + '</span></div>' +
      '<div class="summary-row"><span>Phone</span><span>' + form.elements.phone.value + '</span></div>';
  }

  ['checkin', 'checkout'].forEach(function (name) {
    form.elements[name].addEventListener('change', updateSummary);
  });
  form.elements.guests_select.addEventListener('change', function () {
    state.guests = parseInt(this.value, 10);
    updateSummary();
  });

  /* ---------- Final submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    document.querySelector('.booking-form-panel').innerHTML =
      '<div class="form-success is-visible" role="status">' +
      '<h3 class="display-4">Reservation confirmed</h3>' +
      '<p class="text-muted" style="margin-top:0.75rem;">A confirmation has been sent to ' + form.elements.email.value + '. We look forward to welcoming you to Meridian House.</p>' +
      '<a href="index.html" class="btn btn-primary" style="margin-top:1.5rem;">Return home</a></div>';
  });

  /* ---------- Init ---------- */
  if (state.room) updateSummary();
  goToStep(0);
})();
