// ── Shared utilities ──────────────────────────────────────────────────────────

function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ── Foundation contact + social config (single source of truth) ────────────────
const FOUNDATION = {
  phone:   '+91 98765 43210',
  phoneRaw:'+919876543210',
  email:   'info@krrishnadhwarkafoundation.org',
  address: 'Krrishna Dhwarka Foundation Bharat, India',
  website: 'www.krrishnadhwarkafoundation.org',
};

// Inline social SVG icons (no external icon library needed)
const SOCIAL = {
  facebook:  '<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 8.5 2.6 8.9 2.6 12s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.3-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg>',
  twitter:   '<svg viewBox="0 0 24 24"><path d="M18.9 2H22l-7 8 8.3 11h-6.5l-5-6.6L6 21H2.8l7.5-8.6L2 2h6.6l4.6 6.1L18.9 2zm-1.1 17.2h1.8L7.2 3.8H5.3l12.5 15.4z"/></svg>',
  youtube:   '<svg viewBox="0 0 24 24"><path d="M23 7.5s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C16.7 4 12 4 12 4s-4.7 0-7.8.2c-.4 0-1.4 0-2.3 1-.7.7-.9 2.3-.9 2.3S.8 9.4.8 11.3v1.4c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.2 7.6.2s4.7 0 7.8-.2c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.4c0-1.9-.2-3.8-.2-3.8zM9.8 15.1V8.9l5 3.1-5 3.1z"/></svg>',
};

function socialLinks(cls) {
  return Object.keys(SOCIAL).map(k =>
    `<a href="#" class="${cls}" aria-label="${k}" title="${k.charAt(0).toUpperCase()+k.slice(1)}">${SOCIAL[k]}</a>`
  ).join('');
}

// ── Build shared header ────────────────────────────────────────────────────────
function buildHeader() {
  const mount = document.getElementById('site-header');
  if (!mount) return;
  mount.outerHTML = `
  <header class="site-header" id="siteHeader">
    <div class="top-bar">
      <div class="container">
        <div class="top-bar-info">
          <a href="tel:${FOUNDATION.phoneRaw}"><span class="tb-ico">📞</span> ${FOUNDATION.phone}</a>
          <a href="mailto:${FOUNDATION.email}"><span class="tb-ico">✉️</span> ${FOUNDATION.email}</a>
        </div>
        <div class="top-bar-extra">
          <span class="tb-badge">🪔 शिक्षा का प्रकाश — Light of Education</span>
          <div class="top-social">${socialLinks('')}</div>
        </div>
      </div>
    </div>
    <nav class="navbar">
      <div class="container">
        <a href="/" class="nav-brand">
          <img src="/images/logo2.png" class="nav-logo" alt="KDF Logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="nav-logo-placeholder" style="display:none">K</div>
          <div class="brand-text">
            <span class="brand-name">Krrishna Dhwarka Foundation</span>
            <span class="brand-sub">Bharat – शिक्षा का प्रकाश</span>
          </div>
        </a>
        <ul class="nav-menu" id="navMenu">
          <li><a href="/">Home</a></li>
          <li><a href="/about.html">About Us</a></li>
          <li><a href="/certificates.html">Certificates</a></li>
          <li><a href="/contact.html">Contact</a></li>
          <li><a href="/donate.html" class="nav-donate">❤ Donate Now</a></li>
        </ul>
        <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </nav>
  </header>`;

  // Active link
  document.querySelectorAll('.nav-menu a').forEach(a => {
    if (location.pathname === new URL(a.href).pathname) a.classList.add('active');
  });

  // Mobile hamburger
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', e => { e.stopPropagation(); navMenu.classList.toggle('open'); });
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) navMenu.classList.remove('open');
    });
  }

  // Shrink header on scroll
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Build shared footer ────────────────────────────────────────────────────────
function buildFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  mount.outerHTML = `
  <div class="footer-cta">
    <div class="container">
      <div class="footer-cta-left">
        <h3>Stay Connected With Our Mission</h3>
        <p>Subscribe for impact stories, upcoming events and ways you can help.</p>
      </div>
      <form class="newsletter-form" id="newsletterForm">
        <input type="email" placeholder="Your email address" required aria-label="Email">
        <button type="submit" class="btn btn-primary">Subscribe →</button>
      </form>
    </div>
  </div>
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="nav-brand" style="margin-bottom:1.2rem">
            <img src="/images/logo2.png" class="nav-logo" alt="Logo" onerror="this.style.display='none'">
            <div class="brand-text">
              <span class="brand-name">Krrishna Dhwarka Foundation</span>
              <span class="brand-sub">Bharat</span>
            </div>
          </div>
          <p>Dedicated to spreading the light of education and empowering communities across Bharat through compassionate, transparent service.</p>
          <p style="margin-top:.6rem;color:var(--gold);font-style:italic">शिक्षा का प्रकाश</p>
          <div class="footer-social">${socialLinks('')}</div>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about.html">About Us</a></li>
            <li><a href="/certificates.html">Certificates</a></li>
            <li><a href="/contact.html">Contact Us</a></li>
            <li><a href="/donate.html">Donate Now</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Our Programs</h4>
          <ul>
            <li><a href="/donate.html">Education Support</a></li>
            <li><a href="/donate.html">Skill Development</a></li>
            <li><a href="/donate.html">Community Welfare</a></li>
            <li><a href="/donate.html">Merit Awards</a></li>
            <li><a href="/donate.html">Healthcare Camps</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Get In Touch</h4>
          <div class="contact-item"><span class="ci-icon">📍</span><span>${FOUNDATION.address}</span></div>
          <div class="contact-item"><span class="ci-icon">📧</span><a href="mailto:${FOUNDATION.email}" style="color:inherit">${FOUNDATION.email}</a></div>
          <div class="contact-item"><span class="ci-icon">📞</span><a href="tel:${FOUNDATION.phoneRaw}" style="color:inherit">${FOUNDATION.phone}</a></div>
          <a href="/donate.html" class="btn btn-primary btn-sm" style="margin-top:.5rem">❤ Donate Now</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem">
        <span>© ${new Date().getFullYear()} Krrishna Dhwarka Foundation Bharat. All rights reserved.</span>
        <span>Donations eligible under 80G &nbsp;|&nbsp; <a href="/contact.html">Contact Us</a></span>
      </div>
    </div>
  </footer>
  <button class="back-to-top" id="backToTop" aria-label="Back to top">↑</button>`;

  // Newsletter (front-end only — no backend endpoint)
  const nf = document.getElementById('newsletterForm');
  if (nf) nf.addEventListener('submit', e => {
    e.preventDefault();
    nf.reset();
    toast('Thank you for subscribing! 🙏', 'success');
  });

  // Back to top
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 400), { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

// ── Banner slider ─────────────────────────────────────────────────────────────
async function initSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  let slides = [];
  try {
    const res = await fetch('/api/banners');
    const banners = await res.json();
    if (banners.length > 0) {
      slides = banners.map(b => ({ img: '/uploads/banners/' + b.filename, title: b.title }));
    }
  } catch {}

  const defaultSlide = slider.querySelector('.default-slide');
  if (slides.length === 0) {
    if (defaultSlide) defaultSlide.classList.add('active');
    return;
  }

  if (defaultSlide) defaultSlide.remove();
  slides.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'slide' + (i === 0 ? ' active' : '');
    div.innerHTML = `
      <img src="${s.img}" class="slide-bg" alt="${s.title || 'Banner'}">
      <div class="slide-overlay"></div>
      <div class="slide-content">
        <div class="slide-text">
          <div class="tagline">Krrishna Dhwarka Foundation Bharat</div>
          <h1>${s.title || 'Lighting the Path of Education'}</h1>
          <div class="hindi">शिक्षा का प्रकाश</div>
          <div class="slide-actions">
            <a href="/donate.html" class="btn btn-primary btn-lg">Donate Now</a>
            <a href="/about.html" class="btn btn-outline btn-lg" style="color:#fff;border-color:rgba(255,255,255,.5)">About Us</a>
          </div>
        </div>
      </div>`;
    slider.querySelector('.slides-wrap').appendChild(div);
  });

  buildIndicators(slides.length);
  startAutoplay(slider);
}

function buildIndicators(count) {
  const wrap = document.getElementById('heroIndicators');
  if (!wrap) return;
  wrap.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const b = document.createElement('button');
    b.className = 'indicator' + (i === 0 ? ' active' : '');
    b.addEventListener('click', () => goToSlide(i));
    wrap.appendChild(b);
  }
}

let slideIndex = 0, autoplayTimer;
function goToSlide(n) {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  const all = slider.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.indicator');
  all[slideIndex]?.classList.remove('active');
  dots[slideIndex]?.classList.remove('active');
  slideIndex = (n + all.length) % all.length;
  all[slideIndex]?.classList.add('active');
  dots[slideIndex]?.classList.add('active');
}

function startAutoplay(slider) {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => goToSlide(slideIndex + 1), 5000);
}

// ── Certificates (public page) ────────────────────────────────────────────────
async function loadCertificates() {
  const grid = document.getElementById('certGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading"><div class="spinner"></div> Loading certificates…</div>';
  try {
    const res = await fetch('/api/certificates');
    const certs = await res.json();
    if (!certs.length) { grid.innerHTML = '<p style="text-align:center;color:var(--muted)">No certificates uploaded yet.</p>'; return; }
    grid.innerHTML = certs.map(c => {
      const isPDF = c.filename.toLowerCase().endsWith('.pdf');
      const thumb = isPDF
        ? `<div class="cert-thumb"><span class="pdf-icon">📄</span></div>`
        : `<div class="cert-thumb"><img src="/uploads/certificates/${c.filename}" alt="${c.title}" loading="lazy"></div>`;
      const link = isPDF
        ? `<a href="/uploads/certificates/${c.filename}" target="_blank" class="btn btn-sm btn-navy" style="margin-top:.8rem">View PDF</a>`
        : `<a href="/uploads/certificates/${c.filename}" target="_blank" class="btn btn-sm btn-navy" style="margin-top:.8rem">View</a>`;
      return `<div class="cert-card">
        ${thumb}
        <div class="cert-info">
          <h4>${c.title}</h4>
          ${c.description ? `<p>${c.description}</p>` : ''}
          <small style="color:var(--muted)">${new Date(c.uploaded_at).toLocaleDateString('en-IN')}</small>
          ${link}
        </div>
      </div>`;
    }).join('');
  } catch {
    grid.innerHTML = '<p style="text-align:center;color:var(--muted)">Unable to load certificates.</p>';
  }
}

// ── Scroll reveal animations ────────────────────────────────────────────────────
function initReveal() {
  const targets = document.querySelectorAll(
    '.section-header, .program-card, .mv-card, .cert-card, .team-card, .value-item, ' +
    '.about-content, .about-image-wrapper, .stat-item, .contact-info, .form-card, .donation-sidebar'
  );
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) return; // graceful: elements stay visible (no .reveal)

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => {
    el.classList.add('reveal');
    const idx = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
    io.observe(el);
  });
}

// ── Animated number counters ─────────────────────────────────────────────────────
function initCounters() {
  const nums = document.querySelectorAll('.stat-number');
  if (!nums.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      animateCount(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

function animateCount(el) {
  const m = el.textContent.trim().match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!m) return;
  const prefix = m[1], suffix = m[3];
  const target = parseInt(m[2].replace(/,/g, ''), 10);
  if (isNaN(target)) return;
  const dur = 1400, start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased).toLocaleString('en-IN') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

// ── Init ──────────────────────────────────────────────────────────────────────
// Build shared header/footer immediately (script runs at end of <body>, mounts exist)
buildHeader();
buildFooter();

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  loadCertificates();
  initReveal();
  initCounters();
});
