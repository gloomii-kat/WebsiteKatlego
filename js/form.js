/*
   form.js   contact form behaviour */

/*  Validation rules  */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+\-()\u00A0]{7,15}$/;

/*  Field state helpers  */
function setValid(fieldEl) {
  fieldEl.classList.remove('has-error');
  fieldEl.classList.add('is-valid');
}

function setError(fieldEl) {
  fieldEl.classList.remove('is-valid');
  fieldEl.classList.add('has-error');
}

function clearState(fieldEl) {
  fieldEl.classList.remove('has-error', 'is-valid');
}

/*  Single-field validation */
function validateField(id) {
  const fieldEl = document.getElementById('field-' + id);
  if (!fieldEl) return true;

  const input = document.getElementById(id);
  const val   = input.value.trim();

  switch (id) {
    case 'name':
      val ? setValid(fieldEl) : setError(fieldEl);
      return !!val;

    case 'email':
      EMAIL_RE.test(val) ? setValid(fieldEl) : setError(fieldEl);
      return EMAIL_RE.test(val);

    case 'phone':
      if (!val) { clearState(fieldEl); return true; }
      PHONE_RE.test(val) ? setValid(fieldEl) : setError(fieldEl);
      return PHONE_RE.test(val);

    case 'subject':
      val ? setValid(fieldEl) : setError(fieldEl);
      return !!val;

    case 'message':
      val.length >= 20 ? setValid(fieldEl) : setError(fieldEl);
      return val.length >= 20;

    default:
      return true;
  }
}

/* ── Validate all required fields, return true if all pass ── */
function validateAll() {
  const fields   = ['name', 'email', 'phone', 'subject', 'message'];
  let   allValid = true;
  fields.forEach(id => { if (!validateField(id)) allValid = false; });
  return allValid;
}

/*  Attach blur / focus / live-revalidation to each field  */
function attachFieldListeners() {
  ['name', 'email', 'phone', 'subject', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('blur',  () => validateField(id));
    el.addEventListener('focus', () => document.getElementById('field-' + id)?.classList.add('focused'));
    el.addEventListener('blur',  () => document.getElementById('field-' + id)?.classList.remove('focused'));

    // Re-validate live once a field has already been flagged as invalid
    el.addEventListener('input', () => {
      if (document.getElementById('field-' + id)?.classList.contains('has-error')) {
        validateField(id);
      }
    });
  });
}

/*  Audience pill switcher  */
function initAudiencePills() {
  const pills = document.querySelectorAll('.audience-pill');
  if (!pills.length) return;

  const audienceConfig = {
    recruiter: {
      context: 'Graduate & career enquiries',
      heading: 'Send me a message',
      sub:     "Let me know which role or programme you're recruiting for and I'll get back to you fast.",
      hint:    "Let me know which role or programme you're recruiting for — it helps me respond faster."
    },
    parent: {
      context: 'Tutoring enquiries',
      heading: 'Book a session',
      sub:     "Tell me a bit about your child's needs and I'll suggest how we can work together.",
      hint:    "Share your child's grade and subject — I'll follow up with availability and session details."
    },
    other: {
      context: 'General enquiry',
      heading: 'Say hello',
      sub:     "Drop me a message about anything — collaborations, questions, or just to connect.",
      hint:    "Feel free to write whatever's on your mind — I read every message."
    }
  };

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cfg = audienceConfig[pill.dataset.audience];
      const get = id => document.getElementById(id);

      if (cfg) {
        const ctx = get('formContext');     if (ctx) ctx.textContent = cfg.context;
        const hdg = get('formHeading');     if (hdg) hdg.textContent = cfg.heading;
        const sub = get('formSubheading');  if (sub) sub.textContent = cfg.sub;
        const hnt = get('formHintText');    if (hnt) hnt.textContent = cfg.hint;
      }
    });
  });
}

/*  Tutoring extra fields toggle  */
function initTutoringToggle() {
  const subjectSel     = document.getElementById('subject');
  const tutoringFields = document.getElementById('tutoringFields');
  if (!subjectSel || !tutoringFields) return;

  subjectSel.addEventListener('change', () => {
    const show = subjectSel.value === 'tutoring' || subjectSel.value === 'tutoring-info';
    tutoringFields.style.display = show ? 'flex' : 'none';
  });
}

/*  Character counter  */
function initCharCounter() {
  const messageArea = document.getElementById('message');
  const charCount   = document.getElementById('charCount');
  if (!messageArea || !charCount) return;

  messageArea.addEventListener('input', () => {
    const len = messageArea.value.length;
    charCount.textContent = `${len} / 1000`;
    charCount.classList.toggle('warning', len > 900);
  });
}

/*  Form submission  */
function initFormSubmit() {
  const form         = document.getElementById('contactForm');
  const submitBtn    = document.getElementById('submitBtn');
  const formSection  = document.getElementById('formSection');
  const successState = document.getElementById('successState');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateAll()) {
      form.querySelector('.has-error input, .has-error select, .has-error textarea')?.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    // Swap to success state after simulated async delay
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      formSection.style.display = 'none';
      successState.classList.add('visible');
      successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1400);
  });
}

/*  Reset / send-another  */
function initFormReset() {
  const form         = document.getElementById('contactForm');
  const formSection  = document.getElementById('formSection');
  const successState = document.getElementById('successState');
  const tutoringFields = document.getElementById('tutoringFields');
  const charCount    = document.getElementById('charCount');

  document.getElementById('resetBtn')?.addEventListener('click', () => {
    form?.reset();
    ['name', 'email', 'phone', 'subject', 'message'].forEach(id =>
      clearState(document.getElementById('field-' + id))
    );
    if (charCount)       charCount.textContent      = '0 / 1000';
    if (tutoringFields)  tutoringFields.style.display = 'none';
    if (successState)    successState.classList.remove('visible');
    if (formSection)     formSection.style.display   = 'block';
  });
}

/*  Entry point  */
function initContactForm() {
  initAudiencePills();
  initTutoringToggle();
  initCharCounter();
  attachFieldListeners();
  initFormSubmit();
  initFormReset();
}