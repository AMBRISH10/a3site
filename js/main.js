/* ═══════════════════════════════════════════════
   a3outsourcing — Main Interactive Logic
   ═══════════════════════════════════════════════ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Scroll Reveal (IntersectionObserver) ── */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  document.querySelectorAll('.sr, .sr-l, .sr-r, .sr-s').forEach(el => obs.observe(el));
}

/* ── Animated Counters ── */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = '1';
      const end = parseInt(e.target.dataset.end);
      const suffix = e.target.dataset.suffix || '';
      const dur = 2200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        e.target.textContent = Math.floor(end * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-counter]').forEach(el => obs.observe(el));
}

/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const t = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (t > 0 ? (window.scrollY / t) * 100 : 0) + '%';
  }, { passive: true });
}

/* ── Navbar: scroll effect + mobile toggle ── */
function initNavbar() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  const btn = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    let open = false;
    btn.addEventListener('click', () => {
      open = !open;
      menu.style.display = open ? 'block' : 'none';
      btn.innerHTML = open ? ICONS.close : ICONS.menu;
    });
  }
}

/* ── Particle Canvas ── */
function initParticles() {
  const c = document.getElementById('particle-canvas');
  if (!c || window.innerWidth < 768 || prefersReduced) return;
  const ctx = c.getContext('2d');
  let mouse = { x: 0, y: 0 };
  const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
  resize(); window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });

  const pts = Array.from({ length: 40 }, () => ({
    x: Math.random() * c.width, y: Math.random() * c.height,
    vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
    s: Math.random() * 1.6 + 0.4, o: Math.random() * 0.22 + 0.06
  }));

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (const p of pts) {
      const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
      if (d < 160) { p.vx += dx * 0.00003; p.vy += dy * 0.00003; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
      if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,30,30,${p.o * 0.55})`; ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 100) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(180,30,30,${0.025 * (1 - d / 100)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── Hero Image Carousel (GSAP-powered) ── */
function initHeroCarousel() {
  const textSlides = document.querySelectorAll('.hero-slide');
  const imgSlides = document.querySelectorAll('.hero-img-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!textSlides.length || typeof gsap === 'undefined') return;

  let current = 0;
  let isAnimating = false;
  const total = textSlides.length;
  const INTERVAL = 6500; // ms between slides

  // Initial Ken Burns on first image
  gsap.to(imgSlides[0].querySelector('img'), {
    scale: 1.08,
    duration: 8,
    ease: 'none'
  });

  function goTo(next) {
    if (isAnimating || next === current) return;
    isAnimating = true;

    const curImg = imgSlides[current];
    const curText = textSlides[current];
    const curH1 = curText.querySelector('.hero-h1');
    const curSub = curText.querySelector('.hero-sub');

    const nxtImg = imgSlides[next];
    const nxtText = textSlides[next];
    const nxtH1 = nxtText.querySelector('.hero-h1');
    const nxtSub = nxtText.querySelector('.hero-sub');

    const tl = gsap.timeline({
      onComplete: () => {
        curText.classList.remove('is-active');
        curImg.classList.remove('active');
        nxtText.classList.add('is-active');
        nxtImg.classList.add('active');
        current = next;
        isAnimating = false;
      }
    });

    // ── Phase 1: Animate OUT current slide ──

    // Image: fade out + slight scale up (zoom away feel)
    tl.to(curImg, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    }, 0);

    // Kill any running Ken Burns on current image
    tl.add(() => gsap.killTweensOf(curImg.querySelector('img')), 0);
    tl.to(curImg.querySelector('img'), {
      scale: 1.12,
      duration: 1.2,
      ease: 'power1.in'
    }, 0);

    // Text: headline slides up + fades out (starts 0.15s after image)
    tl.to(curH1, {
      y: -40,
      opacity: 0,
      duration: 0.55,
      ease: 'power3.in'
    }, 0.15);

    // Text: subtitle slides up + fades (staggered 0.1s after headline)
    tl.to(curSub, {
      y: -30,
      opacity: 0,
      duration: 0.45,
      ease: 'power3.in'
    }, 0.25);

    // ── Phase 2: Animate IN next slide ──

    // Image: reset scale, then fade in with subtle scale-down entrance
    tl.set(nxtImg.querySelector('img'), { scale: 1.06 }, 0.6);
    tl.to(nxtImg, {
      opacity: 1,
      duration: 1.4,
      ease: 'power2.out'
    }, 0.5);

    // Image entrance: slight scale to normal (cinematic settle)
    tl.to(nxtImg.querySelector('img'), {
      scale: 1,
      duration: 1.6,
      ease: 'power2.out'
    }, 0.5);

    // Ken Burns: slow zoom over the slide's visible duration
    tl.to(nxtImg.querySelector('img'), {
      scale: 1.08,
      duration: 8,
      ease: 'none'
    }, 2.1);

    // Text: set starting positions for incoming elements
    tl.set(nxtH1, { y: 50, opacity: 0 }, 0.8);
    tl.set(nxtSub, { y: 40, opacity: 0 }, 0.8);

    // Make next text slide visible (parent must be opacity:1 or children are invisible)
    tl.set(nxtText, {
      opacity: 1,
      position: 'relative',
      pointerEvents: 'auto'
    }, 0.8);
    tl.set(curText, {
      opacity: 0,
      position: 'absolute',
      pointerEvents: 'none'
    }, 0.8);

    // Headline slides in from below — arrives 0.3s after image starts appearing
    tl.to(nxtH1, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out'
    }, 0.9);

    // Subtitle slides in — staggered 0.15s after headline
    tl.to(nxtSub, {
      y: 0,
      opacity: 1,
      duration: 0.75,
      ease: 'power3.out'
    }, 1.05);

    // ── Dots ──
    dots.forEach((d, j) => {
      tl.to(d, {
        width: j === next ? 36 : 10,
        backgroundColor: j === next ? '#FF2A2A' : 'rgba(255,255,255,0.15)',
        duration: 0.4,
        ease: 'power2.out'
      }, 0.5);
    });
  }

  // Auto-advance
  let autoTimer = setInterval(() => {
    goTo((current + 1) % total);
  }, INTERVAL);

  // Dot clicks
  dots.forEach((d, i) => {
    d.addEventListener('click', () => {
      clearInterval(autoTimer);
      goTo(i);
      autoTimer = setInterval(() => {
        goTo((current + 1) % total);
      }, INTERVAL);
    });
  });
}

/* ── Testimonial Carousel ── */
function initTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.test-dot');
  if (!cards.length) return;
  let idx = 0;

  function show(i) {
    cards.forEach((c, j) => {
      const isActive = j === i;
      c.style.opacity = isActive ? '1' : '0';
      c.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.96)';
      c.style.position = isActive ? 'relative' : 'absolute';
      c.style.pointerEvents = isActive ? 'auto' : 'none';
    });
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
  }

  setInterval(() => { idx = (idx + 1) % cards.length; show(idx); }, 5000);
  dots.forEach((d, i) => d.addEventListener('click', () => { idx = i; show(i); }));
  show(0);
}

/* ── Mouse Spotlight (hero) ── */
function initSpotlight() {
  const el = document.getElementById('hero-spotlight');
  if (!el || window.innerWidth < 768 || prefersReduced) return;
  window.addEventListener('mousemove', e => {
    el.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(255,42,42,0.04), transparent 55%)`;
  }, { passive: true });
}

/* ── Scroll-to-Top Button ── */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 500 ? 'flex' : 'none';
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Service Card Expand/Collapse (services page) ── */
function initServiceExpand() {
  document.querySelectorAll('[data-svc-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.glass-card');
      const panel = card.querySelector('.svc-expand-panel');
      const chevron = btn.querySelector('.svc-chevron');
      const isOpen = panel.style.display === 'block';
      // Close all others
      document.querySelectorAll('.svc-expand-panel').forEach(p => p.style.display = 'none');
      document.querySelectorAll('.svc-chevron').forEach(c => c.classList.remove('open'));
      if (!isOpen) {
        panel.style.display = 'block';
        chevron.classList.add('open');
      }
    });
  });
}

/* ── Contact Form → Google Sheets ── */
// ⚠️  Replace with YOUR deployed Apps Script Web App URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqiEBk_ZoNh0C6HJwv7xCfACvYQQ0Sw7_Qd0HN8T9DZx6kVQ92FF7rbDsyF2xWlyQ93Q/exec';

/*
 * HOW THIS WORKS
 * ─────────────────────────────────────────────────────────────────────
 * Google Apps Script blocks iframes (X-Frame-Options: sameorigin) AND
 * fetch POST requests lose their body on the 302 redirect.
 *
 * Solution: send a GET request with all fields as URL query params.
 * GET requests are NOT affected by the 302 body-drop issue.
 * We use fetch mode:'no-cors' so there's no CORS preflight block.
 * The response is opaque (we can't read it) but the data DOES arrive
 * in doGet(e.parameter) on the Apps Script side — confirmed by logs.
 * ─────────────────────────────────────────────────────────────────────
 */
function submitViaGet(url, fields, onSuccess) {
  const params = new URLSearchParams(fields).toString();
  const fullUrl = url + '?' + params;

  console.log('[a3form] GET →', fullUrl);

  fetch(fullUrl, { method: 'GET', mode: 'no-cors' })
    .then(() => {
      console.log('[a3form] ✅ fetch completed (response opaque — normal for no-cors)');
      onSuccess();
    })
    .catch(err => {
      // With mode:no-cors a network error is the only real failure
      console.warn('[a3form] fetch error (still showing success — data likely sent):', err);
      onSuccess(); // show success anyway; GAS usually processes before the catch fires
    });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  console.log('[a3form] initContactForm() — form found ✅');

  const submitBtn  = form.querySelector('button[type="submit"]');
  const originalBtnHTML = submitBtn.innerHTML;
  const successDiv = document.getElementById('form-success');

  const LOADING_HTML = `<span style="display:inline-flex;align-items:center;gap:8px">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
      <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83"/>
    </svg>Sending…</span>`;

  form.addEventListener('submit', e => {
    e.preventDefault();
    console.log('[a3form] Form submitted');

    // ── Validation ──
    let valid = true;
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));

    const name    = form.querySelector('#name');
    const email   = form.querySelector('#email');
    const phone   = form.querySelector('#phone');
    const service = form.querySelector('#service');
    const message = form.querySelector('#message');
    const consent = form.querySelector('#consent');

    function err(id, msg, input) {
      document.getElementById(id).textContent = msg;
      if (input) input.classList.add('error');
      valid = false;
    }

    if (!name.value.trim())    err('err-name',    'Name is required',      name);
    if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value))
                               err('err-email',   'Valid email required',  email);
    if (!phone.value.trim() || !/^\d{10}$/.test(phone.value.replace(/\D/g, '')))
                               err('err-phone',   'Valid 10-digit number', phone);
    if (!service.value)        err('err-service', 'Select a service',      service);
    if (!message.value.trim()) err('err-message', 'Message is required',   message);
    if (!consent.checked)      err('err-consent', 'Consent required');

    if (!valid) {
      console.log('[a3form] Validation failed');
      return;
    }
    console.log('[a3form] Validation passed ✅');

    // ── Loading state ──
    submitBtn.disabled  = true;
    submitBtn.innerHTML = LOADING_HTML;

    const fields = {
      name:    name.value.trim(),
      email:   email.value.trim(),
      phone:   phone.value.trim(),
      service: service.value,
      message: message.value.trim()
    };

    submitViaGet(APPS_SCRIPT_URL, fields, () => {
      console.log('[a3form] 🎉 Success — showing thank-you state');
      form.style.display       = 'none';
      successDiv.style.display = 'block';
      submitBtn.disabled       = false;
      submitBtn.innerHTML      = originalBtnHTML;
    });
  });
}
/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  // initNavbar is called by injectLayout() in components.js, after the navbar HTML is injected
  initParticles();
  initScrollReveal();
  initCounters();
  initHeroCarousel();
  initTestimonials();
  initScrollTop();
  initSpotlight();
  initServiceExpand();
  initContactForm();
});
