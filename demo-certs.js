// Demo certificate generator + seeder (committed, reproducible).
// - writeFiles(): writes the branded SVG certificates into the uploads folder
// - seed(db):     writes the files (if needed) and inserts DB rows idempotently
// Called from server.js on startup so the certificates appear on a fresh clone.
const path = require('path');
const fs = require('fs');

const certDir = path.join(__dirname, 'public', 'uploads', 'certificates');
const NAVY = '#1a1f4e', GOLD = '#c9a84c', GOLDD = '#a8842f', CREAM = '#fdf8f0';
const MOTTO = 'शिक्षा का प्रकाश'; // शिक्षा का प्रकाश

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function certSVG(c) {
  const W = 1000, H = 720;
  const ticks = Array.from({ length: 36 }).map((_, i) => {
    const a = i / 36 * Math.PI * 2;
    return `<line x1="${(Math.cos(a)*54).toFixed(1)}" y1="${(Math.sin(a)*54).toFixed(1)}" x2="${(Math.cos(a)*60).toFixed(1)}" y2="${(Math.sin(a)*60).toFixed(1)}" stroke="${GOLD}" stroke-width="1.5"/>`;
  }).join('');
  const corners = [[30,30],[W-30,30],[30,H-30],[W-30,H-30]]
    .map(([x,y]) => `<rect x="${x-8}" y="${y-8}" width="16" height="16" fill="${GOLD}" transform="rotate(45 ${x} ${y})"/>`).join('');
  const body = c.bodyLines.map((ln, i) =>
    `<text x="500" y="${450 + i*26}" text-anchor="middle" font-size="15" fill="#4a4a4a">${esc(ln)}</text>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Georgia, 'Times New Roman', serif">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect x="16" y="16" width="${W-32}" height="${H-32}" fill="none" stroke="${GOLD}" stroke-width="4"/>
  <rect x="30" y="30" width="${W-60}" height="${H-60}" fill="none" stroke="${NAVY}" stroke-width="1.2"/>
  ${corners}
  <text x="500" y="92" text-anchor="middle" font-size="25" font-weight="bold" fill="${NAVY}" letter-spacing="1.5">KRRISHNA DHWARKA FOUNDATION BHARAT</text>
  <text x="500" y="120" text-anchor="middle" font-size="15" fill="${GOLDD}" font-style="italic">${MOTTO}  &#8226;  Light of Education</text>
  <line x1="350" y1="138" x2="650" y2="138" stroke="${GOLD}" stroke-width="1.5"/>
  <g transform="translate(500,210)">
    <circle r="46" fill="${NAVY}"/>
    <circle r="46" fill="none" stroke="${GOLD}" stroke-width="2.5"/>
    ${ticks}
    <text y="-3" text-anchor="middle" font-size="26" font-weight="bold" fill="${GOLD}">KDF</text>
    <text y="17" text-anchor="middle" font-size="10" fill="${CREAM}" letter-spacing="1.5">BHARAT</text>
  </g>
  <rect x="350" y="286" width="300" height="34" rx="17" fill="${CREAM}" stroke="${GOLD}" stroke-width="1.2"/>
  <text x="500" y="309" text-anchor="middle" font-size="13" font-weight="bold" fill="${GOLDD}" letter-spacing="2">${esc(c.type)}</text>
  <text x="500" y="372" text-anchor="middle" font-size="32" font-weight="bold" fill="${NAVY}">${esc(c.title)}</text>
  <text x="500" y="402" text-anchor="middle" font-size="15" fill="${GOLDD}" font-style="italic">${esc(c.subtitle)}</text>
  ${body}
  <text x="225" y="600" text-anchor="middle" font-size="12" fill="#666">Ref No: ${esc(c.refNo)}</text>
  <line x1="135" y1="588" x2="315" y2="588" stroke="${NAVY}" stroke-width="1"/>
  <text x="225" y="616" text-anchor="middle" font-size="11" fill="#888">Registration Authority</text>
  <text x="775" y="588" text-anchor="middle" font-size="14" font-weight="bold" fill="${NAVY}">For KDF Bharat</text>
  <line x1="685" y1="600" x2="865" y2="600" stroke="${NAVY}" stroke-width="1"/>
  <text x="775" y="616" text-anchor="middle" font-size="11" fill="#888">Authorised Signatory</text>
  <text x="500" y="662" text-anchor="middle" font-size="13" fill="#555">Issued on ${esc(c.date)}</text>
</svg>`;
}

const DEMO_CERTS = [
  { file: 'demo-80g-exemption.svg', title: '80G Tax Exemption', desc: 'Donations are eligible for tax deduction under Section 80G.',
    type: 'REGISTRATION CERTIFICATE', subtitle: 'Income Tax Act, 1961 — Section 80G', refNo: 'KDF/80G/2024/0142', date: '12 January 2024',
    bodyLines: ['This certifies that donations made to Krrishna Dhwarka Foundation', 'Bharat are eligible for tax deduction under Section 80G of the', 'Income Tax Act, 1961.'] },
  { file: 'demo-12a-registration.svg', title: '12A Registration', desc: 'Registered charitable trust under Section 12A.',
    type: 'REGISTRATION CERTIFICATE', subtitle: 'Registered Charitable Organisation', refNo: 'KDF/12A/2024/0098', date: '12 January 2024',
    bodyLines: ['Krrishna Dhwarka Foundation Bharat is registered under Section 12A', 'of the Income Tax Act as a charitable organisation working for', 'education and community welfare.'] },
  { file: 'demo-ngo-darpan.svg', title: 'NGO Darpan Registration', desc: 'Registered with NITI Aayog NGO Darpan.',
    type: 'GOVERNMENT REGISTRATION', subtitle: 'NITI Aayog — Government of India', refNo: 'BH/2024/0356781', date: '05 February 2024',
    bodyLines: ['This organisation is registered on the NGO Darpan portal of NITI', 'Aayog, Government of India, with a unique identity ensuring', 'transparency and accountability.'] },
  { file: 'demo-excellence.svg', title: 'Certificate of Excellence', desc: 'Recognition for service to education and community.',
    type: 'AWARD OF RECOGNITION', subtitle: 'Service to Education & Community', refNo: 'KDF/AWD/2024/0011', date: '20 March 2024',
    bodyLines: ['Awarded in recognition of outstanding contribution towards', 'spreading the light of education and empowering underprivileged', 'communities across Bharat.'] },
  { file: 'demo-csr1.svg', title: 'CSR-1 Registration', desc: 'Eligible to receive CSR funding (Form CSR-1).',
    type: 'REGISTRATION CERTIFICATE', subtitle: 'Ministry of Corporate Affairs — Form CSR-1', refNo: 'CSR00012345', date: '18 February 2024',
    bodyLines: ['Registered with the Ministry of Corporate Affairs under Form CSR-1,', 'enabling the foundation to receive Corporate Social Responsibility', '(CSR) contributions from companies.'] },
  { file: 'demo-section8.svg', title: 'Section 8 Company', desc: 'Incorporated as a Section 8 non-profit company.',
    type: 'INCORPORATION CERTIFICATE', subtitle: 'Companies Act, 2013 — Section 8', refNo: 'U85300DL2023NPL000142', date: '10 December 2023',
    bodyLines: ['Incorporated as a not-for-profit organisation under Section 8 of', 'the Companies Act, 2013, dedicated to the promotion of education', 'and social welfare.'] },
  { file: 'demo-fcra.svg', title: 'FCRA Registration', desc: 'Permitted to receive foreign contributions (FCRA).',
    type: 'GOVERNMENT REGISTRATION', subtitle: 'Foreign Contribution (Regulation) Act, 2010', refNo: '231650142', date: '02 April 2024',
    bodyLines: ['Registered under the Foreign Contribution (Regulation) Act, 2010,', 'permitting the foundation to receive foreign contributions for', 'its charitable programmes.'] },
  { file: 'demo-iso.svg', title: 'ISO 9001:2015', desc: 'ISO 9001:2015 certified quality management.',
    type: 'QUALITY CERTIFICATION', subtitle: 'Quality Management System', refNo: 'IN-QMS-2024-0786', date: '15 April 2024',
    bodyLines: ['Certified for conformity with the ISO 9001:2015 Quality Management', 'System standard across its education and welfare programme', 'operations.'] },
];

function writeFiles() {
  fs.mkdirSync(certDir, { recursive: true });
  DEMO_CERTS.forEach(c => fs.writeFileSync(path.join(certDir, c.file), certSVG(c), 'utf8'));
  console.log(`Wrote ${DEMO_CERTS.length} certificate SVGs to ${certDir}`);
}

function seed(db) {
  fs.mkdirSync(certDir, { recursive: true });
  let added = 0;
  for (const c of DEMO_CERTS) {
    try { fs.writeFileSync(path.join(certDir, c.file), certSVG(c), 'utf8'); } catch {}
    const exists = db.prepare('SELECT 1 FROM certificates WHERE filename=?').get(c.file);
    if (!exists) {
      db.prepare('INSERT INTO certificates (title,description,filename) VALUES (?,?,?)').run(c.title, c.desc, c.file);
      added++;
    }
  }
  if (added) console.log(`Seeded ${added} demo certificate(s).`);
}

module.exports = { writeFiles, seed, DEMO_CERTS, certSVG };

// Allow `node demo-certs.js` to just (re)write the image files.
if (require.main === module) writeFiles();
