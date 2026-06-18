/* ============================================================
   home.js — homepage interactive sections
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Testimonial carousel ---------- */
  var slides = document.querySelectorAll('.testimonial-slide');
  var dotsWrap = document.querySelector('.carousel-dots');
  var prevBtn = document.querySelector('.carousel-arrow.prev');
  var nextBtn = document.querySelector('.carousel-arrow.next');
  var current = 0;
  var autoTimer;

  if (slides.length) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dotsWrap.children[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dotsWrap.children[current].classList.add('is-active');
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { goTo(current + 1); }, 6500);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

    resetAuto();
  }

  /* ---------- Animated stat counters ---------- */
  var statEls = document.querySelectorAll('.stat-number');
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var suffixEl = el.querySelector('.suffix');
    var suffix = suffixEl ? suffixEl.outerHTML : '';
    var decimals = el.dataset.count.indexOf('.') > -1 ? 1 : 0;
    var duration = 1800;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = (target * eased).toFixed(decimals);
      el.innerHTML = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statEls.length) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statEls.forEach(function (el) { statIO.observe(el); });
  }

  /* ---------- Hero booking widget -> booking page ---------- */
  var heroBookingForm = document.querySelector('.hero-widget-wrap form, .home-booking-form');
  if (heroBookingForm) {
    heroBookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var checkin = heroBookingForm.querySelector('[name="checkin"]').value;
      var checkout = heroBookingForm.querySelector('[name="checkout"]').value;
      var guests = heroBookingForm.querySelector('[name="guests"]').value;
      var params = new URLSearchParams();
      if (checkin) params.set('checkin', checkin);
      if (checkout) params.set('checkout', checkout);
      if (guests) params.set('guests', guests);
      window.location.href = 'booking.html' + (params.toString() ? '?' + params.toString() : '');
    });
  }
})();
