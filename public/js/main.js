// ── Shared utilities ──────────────────────────────────────────────────────────

function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

function logoHTML(size = 52) {
  const img = document.querySelector('.nav-logo');
  if (img) return '';
  return `<div class="nav-logo-placeholder" style="width:${size}px;height:${size}px;font-size:${Math.round(size*.45)}px">K</div>`;
}

// ── Navbar active link ────────────────────────────────────────────────────────
document.querySelectorAll('.nav-menu a').forEach(a => {
  if (a.href === location.href || location.pathname === new URL(a.href).pathname) {
    a.classList.add('active');
  }
});

// ── Mobile hamburger ──────────────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => navMenu.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) navMenu.classList.remove('open');
  });
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

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  loadCertificates();
});
