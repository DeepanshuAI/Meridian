/* ============================================================
   contact.js — contact form validation
   ============================================================ */
(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var successBox = document.querySelector('.form-success');

  var validators = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.'; },
    phone: function (v) { return v.trim() === '' || /^[+\d][\d\s().-]{6,}$/.test(v) ? '' : 'Please enter a valid phone number.'; },
    subject: function (v) { return v ? '' : 'Please select a subject.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'; }
  };

  function showError(field, msg) {
    var wrap = field.closest('.form-field');
    var errEl = wrap.querySelector('.form-error');
    if (msg) {
      wrap.classList.add('has-error');
      errEl.textContent = msg;
    } else {
      wrap.classList.remove('has-error');
      errEl.textContent = '';
    }
  }

  function validateField(field) {
    var validator = validators[field.name];
    if (!validator) return true;
    var msg = validator(field.value);
    showError(field, msg);
    return !msg;
  }

  Object.keys(validators).forEach(function (name) {
    var field = form.elements[name];
    if (!field) return;
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.closest('.form-field').classList.contains('has-error')) validateField(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (field && !validateField(field)) valid = false;
    });

    if (!valid) {
      var firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    successBox.classList.add('is-visible');
    successBox.setAttribute('role', 'status');
    form.reset();
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
