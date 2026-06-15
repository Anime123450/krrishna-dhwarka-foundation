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

// ── Line-style SVG icon set (replaces emoji site-wide) ──────────────────────────
const ICONS = {
  phone:   '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  mail:    '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  location:'<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  globe:   '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg>',
  clipboard:'<svg viewBox="0 0 24 24"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/></svg>',
  calendar:'<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M8 3v4M16 3v4"/></svg>',
  heart:   '<svg viewBox="0 0 24 24"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"/></svg>',
  target:  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/></svg>',
  eye:     '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  book:    '<svg viewBox="0 0 24 24"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3H11v17H4.5A1.5 1.5 0 0 0 3 21.5z"/><path d="M21 4.5A1.5 1.5 0 0 0 19.5 3H13v17h6.5a1.5 1.5 0 0 1 1.5 1.5z"/></svg>',
  briefcase:'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
  leaf:    '<svg viewBox="0 0 24 24"><path d="M4 20s.5-9 8-13c0 0 5-2 8-2 0 3-1 8-3 11-3.5 5-13 4-13 4z"/><path d="M9 15c2-2 4-3 6-4"/></svg>',
  award:   '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="6"/><path d="m9 14-2 7 5-3 5 3-2-7"/></svg>',
  palette: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2 0-1.5 1-2 2-2h2a3 3 0 0 0 3-3 8 8 0 0 0-9-9z"/><circle cx="7.5" cy="11" r="1"/><circle cx="11" cy="7.5" r="1"/><circle cx="15.5" cy="9" r="1"/></svg>',
  heartbeat:'<svg viewBox="0 0 24 24"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"/><path d="M3.7 12.5H8l1.5-3 2 5 1.4-2.5h4"/></svg>',
  laptop:  '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="11" rx="1"/><path d="M2 20h20"/></svg>',
  users:   '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0M16 5a3.5 3.5 0 0 1 0 7M21 20a6 6 0 0 0-4-5.6"/></svg>',
  shield:  '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  scale:   '<svg viewBox="0 0 24 24"><path d="M12 3v18M6 21h12M7 6h10"/><path d="M7 6 4 12h6zM17 6l-3 6h6z"/></svg>',
  wallet:  '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14h2"/></svg>',
  chart:   '<svg viewBox="0 0 24 24"><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7"/></svg>',
  file:    '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
  lock:    '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  check:   '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 5-5"/></svg>',
  building:'<svg viewBox="0 0 24 24"><path d="M4 21V8l8-5 8 5v13"/><path d="M4 21h16M9 21v-5h6v5"/><path d="M9 11h.01M15 11h.01M9 14h.01M15 14h.01"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>',
};

function renderIcons(root = document) {
  root.querySelectorAll('.ico[data-ico]:not([data-done])').forEach(el => {
    const svg = ICONS[el.dataset.ico];
    if (svg) { el.innerHTML = svg; el.setAttribute('data-done', '1'); }
  });
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
          <a href="tel:${FOUNDATION.phoneRaw}"><span class="tb-ico ico" data-ico="phone"></span> ${FOUNDATION.phone}</a>
          <a href="mailto:${FOUNDATION.email}"><span class="tb-ico ico" data-ico="mail"></span> ${FOUNDATION.email}</a>
        </div>
        <div class="top-bar-extra">
          <span class="tb-badge">शिक्षा का प्रकाश — Light of Education</span>
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
          <li><a href="/donate.html" class="nav-donate"><span class="ico" data-ico="heart"></span> Donate Now</a></li>
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
          <div class="contact-item"><span class="ci-icon ico" data-ico="location"></span><span>${FOUNDATION.address}</span></div>
          <div class="contact-item"><span class="ci-icon ico" data-ico="mail"></span><a href="mailto:${FOUNDATION.email}" style="color:inherit">${FOUNDATION.email}</a></div>
          <div class="contact-item"><span class="ci-icon ico" data-ico="phone"></span><a href="tel:${FOUNDATION.phoneRaw}" style="color:inherit">${FOUNDATION.phone}</a></div>
          <a href="/donate.html" class="btn btn-primary btn-sm" style="margin-top:.5rem"><span class="ico" data-ico="heart"></span> Donate Now</a>
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
    toast('Thank you for subscribing!', 'success');
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
  addSwipe(slider,
    () => { goToSlide(slideIndex + 1); startAutoplay(slider); },
    () => { goToSlide(slideIndex - 1); startAutoplay(slider); });
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
        ? `<div class="cert-thumb"><span class="pdf-icon ico" data-ico="file"></span></div>`
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
    renderIcons(grid);
  } catch {
    grid.innerHTML = '<p style="text-align:center;color:var(--muted)">Unable to load certificates.</p>';
  }
}

// ── "Who We Are" auto-sliding gallery (admin managed) ──────────────────────────
async function initWhoSlider() {
  const wrap = document.getElementById('whoSlider');
  if (!wrap) return;
  let images = [];
  try {
    const res = await fetch('/api/gallery');
    images = await res.json();
  } catch {}

  // Fall back to donation-themed stock images until the admin uploads their own
  if (!images.length) {
    images = [
      { src: 'https://loremflickr.com/800/600/children,education,india?lock=21', title: 'Education for every child' },
      { src: 'https://loremflickr.com/800/600/charity,volunteer,community?lock=22', title: 'Serving with compassion' },
      { src: 'https://loremflickr.com/800/600/donation,help,hands?lock=23', title: 'Your support changes lives' },
    ];
  }

  const fallback = document.getElementById('whoFallback');
  if (fallback) fallback.remove();

  wrap.innerHTML = images.map((g, i) => {
    const src = g.src || ('/uploads/gallery/' + g.filename);
    return `
    <div class="who-slide${i === 0 ? ' active' : ''}">
      <img src="${src}" alt="${(g.title || 'Our work').replace(/"/g, '')}" loading="lazy" onerror="this.src='/images/logo2.png';this.style.objectFit='contain';this.style.background='#fff';this.style.padding='2rem'">
      ${g.title ? `<div class="who-cap">${escapeHTML(g.title)}</div>` : ''}
    </div>`; }).join('') +
    (images.length > 1
      ? `<div class="who-dots">${images.map((_, i) => `<button class="${i === 0 ? 'active' : ''}" aria-label="Slide ${i+1}"></button>`).join('')}</div>`
      : '');

  if (images.length < 2) return;

  const slides = wrap.querySelectorAll('.who-slide');
  const dots = wrap.querySelectorAll('.who-dots button');
  let idx = 0, timer;

  function go(n) {
    slides[idx].classList.remove('active'); dots[idx].classList.remove('active');
    idx = (n + slides.length) % slides.length;
    slides[idx].classList.add('active'); dots[idx].classList.add('active');
  }
  function play() { clearInterval(timer); timer = setInterval(() => go(idx + 1), 4000); }
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); play(); }));
  addSwipe(wrap, () => { go(idx + 1); play(); }, () => { go(idx - 1); play(); });
  play();
}

function escapeHTML(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Lightweight touch-swipe helper (better mobile interaction)
function addSwipe(el, onLeft, onRight) {
  let x0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) (dx < 0 ? onLeft : onRight)();
    x0 = null;
  }, { passive: true });
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
renderIcons();

document.addEventListener('DOMContentLoaded', () => {
  renderIcons();          // fill any static page icons
  initSlider();
  initWhoSlider();
  loadCertificates();
  initReveal();
  initCounters();
});
