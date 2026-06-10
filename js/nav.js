/* ─────────────────────────────────────────
   nav.js  —  shared across all pages
   Each feature is a self-contained function.
   Call initNav() once the DOM is ready.
───────────────────────────────────────── */

/* ── 1. Hide / show navbar on scroll ── */
function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('nav--hidden', y > lastY && y > 80);
    lastY = y;
  }, { passive: true });
}

/* ── 2. Hamburger mobile menu ── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

/* Exported so mobile-menu links can call it inline: onclick="closeMobile()" */
function closeMobile() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ── 3. Scroll-spy dots + nav link highlighting ── */
function initScrollSpy(sectionIds) {
  const dots     = document.querySelectorAll('.scroll-spy__dot');
  const navLinks = document.querySelectorAll('.nav__links a[data-section]');
  if (!sectionIds || sectionIds.length === 0) return;

  function update() {
    const midY = window.scrollY + window.innerHeight / 2;
    let active = sectionIds[0];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= midY) active = id;
    }

    dots.forEach(d =>
      d.classList.toggle('active', d.dataset.target === active)
    );
    navLinks.forEach(a =>
      a.classList.toggle('active', a.dataset.section === active)
    );
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // run once on load

  dots.forEach(d => {
    d.addEventListener('click', () => {
      document.getElementById(d.dataset.target)
        ?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ── 4. Fade-up on scroll (IntersectionObserver) ── */
function initFadeUp(heroSelector) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* Stagger elements inside the hero / intro section */
  if (heroSelector) {
    document.querySelectorAll(`${heroSelector} .fade-up`).forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.12}s`;
    });
  }
}

/* ── 5. Skill-bar animation (about.html only) ── */
function initSkillBars() {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar__fill').forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });
        barObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-animate]').forEach(el =>
    barObserver.observe(el)
  );
}

/* ── 6. FAQ accordion (tutoring.html only) ── */
function initFaqAccordion() {
  document.querySelectorAll('.faq-item__question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}
 
/* ── Entry point — call with page-specific config ── */
function initNav({ sections = [], heroSelector = null, features = [] } = {}) {
  initNavScroll();
  initHamburger();
  initScrollSpy(sections);
  initFadeUp(heroSelector);
 
  if (features.includes('skillBars'))    initSkillBars();
  if (features.includes('faqAccordion')) initFaqAccordion();
}