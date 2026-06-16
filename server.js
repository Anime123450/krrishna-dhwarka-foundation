require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const { DatabaseSync: Database } = require('node:sqlite');
const Razorpay = require('razorpay');
const PDFDocument = require('pdfkit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'krrishna-dhwarka-secret-2024';

// ─── Database ────────────────────────────────────────────────────────────────
const db = new Database(path.join(__dirname, 'foundation.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    subject TEXT DEFAULT '',
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_id TEXT UNIQUE NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    donor_phone TEXT DEFAULT '',
    donor_pan TEXT DEFAULT '',
    amount REAL NOT NULL,
    purpose TEXT DEFAULT 'General Donation',
    address TEXT DEFAULT '',
    payment_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    filename TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT DEFAULT '',
    filename TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT DEFAULT '',
    filename TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

// Seed default admin
const adminCount = db.prepare('SELECT COUNT(*) as c FROM admins').get();
if (adminCount.c === 0) {
  const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run(
    process.env.ADMIN_USERNAME || 'admin', hash
  );
  console.log('Default admin created: admin / admin123');
}

// ─── Upload directories ───────────────────────────────────────────────────────
['certificates', 'banners', 'gallery'].forEach(d => {
  const dir = path.join(__dirname, 'public', 'uploads', d);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Seed branded demo certificates (idempotent — writes files + DB rows if missing)
try { require('./demo-certs').seed(db); } catch (e) { console.error('cert seed:', e.message); }

// ─── Razorpay ─────────────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Multer ───────────────────────────────────────────────────────────────────
function makeStorage(subfolder) {
  return multer.diskStorage({
    destination: path.join(__dirname, 'public', 'uploads', subfolder),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
  });
}

const uploadCert = multer({
  storage: makeStorage('certificates'),
  fileFilter: (req, file, cb) => cb(null, /\.(jpe?g|png|pdf|webp)$/i.test(file.originalname)),
  limits: { fileSize: 15 * 1024 * 1024 }
});

const uploadBanner = multer({
  storage: makeStorage('banners'),
  fileFilter: (req, file, cb) => cb(null, /\.(jpe?g|png|webp)$/i.test(file.originalname)),
  limits: { fileSize: 8 * 1024 * 1024 }
});

const uploadGallery = multer({
  storage: makeStorage('gallery'),
  fileFilter: (req, file, cb) => cb(null, /\.(jpe?g|png|webp)$/i.test(file.originalname)),
  limits: { fileSize: 8 * 1024 * 1024 }
});

// ─── Auth middleware ──────────────────────────────────────────────────────────
function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorised' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════

// Inquiry submit
app.post('/api/inquiry', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required' });
  const r = db.prepare('INSERT INTO inquiries (name,email,phone,subject,message) VALUES (?,?,?,?,?)').run(name, email, phone||'', subject||'', message);
  res.json({ success: true, id: r.lastInsertRowid });
});

// Create Razorpay order
app.post('/api/donation/create-order', async (req, res) => {
  const { amount, donor_name, donor_email, donor_phone, donor_pan, purpose, address } = req.body;
  if (!amount || !donor_name || !donor_email) return res.status(400).json({ error: 'Amount, name and email required' });

  try {
    const receiptId = 'KDF-' + Date.now();
    const order = await razorpay.orders.create({
      amount: Math.round(parseFloat(amount) * 100),
      currency: 'INR',
      receipt: receiptId,
      notes: { donor_name, donor_email, purpose: purpose || 'General Donation' }
    });

    db.prepare(`INSERT INTO donations
      (receipt_id,razorpay_order_id,donor_name,donor_email,donor_phone,donor_pan,amount,purpose,address,payment_status)
      VALUES (?,?,?,?,?,?,?,?,?,'pending')`)
      .run(receiptId, order.id, donor_name, donor_email, donor_phone||'', donor_pan||'', parseFloat(amount), purpose||'General Donation', address||'');

    res.json({
      success: true,
      order_id: order.id,
      receipt_id: receiptId,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    });
  } catch (err) {
    console.error('Razorpay error:', err.message);
    res.status(500).json({ error: 'Could not create payment order. Check Razorpay keys.' });
  }
});

// Verify payment signature
app.post('/api/donation/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
  const expected = crypto.createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  db.prepare(`UPDATE donations SET razorpay_payment_id=?, payment_status='completed' WHERE razorpay_order_id=?`)
    .run(razorpay_payment_id, razorpay_order_id);

  const donation = db.prepare('SELECT * FROM donations WHERE razorpay_order_id=?').get(razorpay_order_id);
  res.json({ success: true, receipt_id: donation.receipt_id });
});

// Public receipt download
app.get('/api/receipt/:receiptId', (req, res) => {
  const d = db.prepare("SELECT * FROM donations WHERE receipt_id=? AND payment_status='completed'").get(req.params.receiptId);
  if (!d) return res.status(404).json({ error: 'Receipt not found' });
  sendReceiptPDF(d, res);
});

// Public banners
app.get('/api/banners', (req, res) => {
  res.json(db.prepare('SELECT * FROM banners WHERE is_active=1 ORDER BY sort_order ASC').all());
});

// Admin: all banners (active + inactive)
app.get('/api/admin/banners', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM banners ORDER BY sort_order ASC, uploaded_at DESC').all());
});

// Public certificates
app.get('/api/certificates', (req, res) => {
  res.json(db.prepare('SELECT * FROM certificates ORDER BY uploaded_at DESC').all());
});

// Public gallery (Who We Are auto-slider)
app.get('/api/gallery', (req, res) => {
  res.json(db.prepare('SELECT * FROM gallery WHERE is_active=1 ORDER BY sort_order ASC, uploaded_at DESC').all());
});

// Admin: all gallery images (active + inactive)
app.get('/api/admin/gallery', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM gallery ORDER BY sort_order ASC, uploaded_at DESC').all());
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ADMIN API
// ═══════════════════════════════════════════════════════════════════════════════

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE username=?').get(username);
  if (!admin || !bcrypt.compareSync(password, admin.password))
    return res.status(401).json({ error: 'Invalid username or password' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, token, username: admin.username });
});

// Dashboard stats
app.get('/api/admin/stats', auth, (req, res) => {
  const totalAmount = db.prepare("SELECT COALESCE(SUM(amount),0) as t FROM donations WHERE payment_status='completed'").get().t;
  const totalDonations = db.prepare("SELECT COUNT(*) as c FROM donations WHERE payment_status='completed'").get().c;
  const totalInquiries = db.prepare('SELECT COUNT(*) as c FROM inquiries').get().c;
  const unread = db.prepare('SELECT COUNT(*) as c FROM inquiries WHERE is_read=0').get().c;
  const totalCerts = db.prepare('SELECT COUNT(*) as c FROM certificates').get().c;
  res.json({ totalAmount, totalDonations, totalInquiries, unread, totalCerts });
});

// Inquiries
app.get('/api/admin/inquiries', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all());
});
app.patch('/api/admin/inquiries/:id/read', auth, (req, res) => {
  db.prepare('UPDATE inquiries SET is_read=1 WHERE id=?').run(req.params.id);
  res.json({ success: true });
});
app.delete('/api/admin/inquiries/:id', auth, (req, res) => {
  db.prepare('DELETE FROM inquiries WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// Donations
app.get('/api/admin/donations', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM donations ORDER BY created_at DESC').all());
});
app.get('/api/admin/receipt/:id', auth, (req, res) => {
  const d = db.prepare('SELECT * FROM donations WHERE id=?').get(req.params.id);
  if (!d) return res.status(404).json({ error: 'Not found' });
  sendReceiptPDF(d, res);
});

// Certificates
app.post('/api/admin/certificates', auth, uploadCert.single('file'), (req, res) => {
  if (!req.file || !req.body.title) return res.status(400).json({ error: 'File and title required' });
  db.prepare('INSERT INTO certificates (title,description,filename) VALUES (?,?,?)').run(req.body.title, req.body.description||'', req.file.filename);
  res.json({ success: true });
});
app.delete('/api/admin/certificates/:id', auth, (req, res) => {
  const c = db.prepare('SELECT * FROM certificates WHERE id=?').get(req.params.id);
  if (c) {
    try { fs.unlinkSync(path.join(__dirname, 'public', 'uploads', 'certificates', c.filename)); } catch {}
    db.prepare('DELETE FROM certificates WHERE id=?').run(req.params.id);
  }
  res.json({ success: true });
});

// Banners
app.post('/api/admin/banners', auth, uploadBanner.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Image file required' });
  db.prepare('INSERT INTO banners (title,filename,sort_order) VALUES (?,?,?)').run(req.body.title||'', req.file.filename, parseInt(req.body.sort_order)||0);
  res.json({ success: true });
});
app.patch('/api/admin/banners/:id/toggle', auth, (req, res) => {
  const b = db.prepare('SELECT * FROM banners WHERE id=?').get(req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE banners SET is_active=? WHERE id=?').run(b.is_active ? 0 : 1, req.params.id);
  res.json({ success: true });
});
app.delete('/api/admin/banners/:id', auth, (req, res) => {
  const b = db.prepare('SELECT * FROM banners WHERE id=?').get(req.params.id);
  if (b) {
    try { fs.unlinkSync(path.join(__dirname, 'public', 'uploads', 'banners', b.filename)); } catch {}
    db.prepare('DELETE FROM banners WHERE id=?').run(req.params.id);
  }
  res.json({ success: true });
});

// Gallery (Who We Are images)
app.post('/api/admin/gallery', auth, uploadGallery.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Image file required' });
  db.prepare('INSERT INTO gallery (title,filename,sort_order) VALUES (?,?,?)').run(req.body.title||'', req.file.filename, parseInt(req.body.sort_order)||0);
  res.json({ success: true });
});
app.patch('/api/admin/gallery/:id/toggle', auth, (req, res) => {
  const g = db.prepare('SELECT * FROM gallery WHERE id=?').get(req.params.id);
  if (!g) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE gallery SET is_active=? WHERE id=?').run(g.is_active ? 0 : 1, req.params.id);
  res.json({ success: true });
});
app.delete('/api/admin/gallery/:id', auth, (req, res) => {
  const g = db.prepare('SELECT * FROM gallery WHERE id=?').get(req.params.id);
  if (g) {
    try { fs.unlinkSync(path.join(__dirname, 'public', 'uploads', 'gallery', g.filename)); } catch {}
    db.prepare('DELETE FROM gallery WHERE id=?').run(req.params.id);
  }
  res.json({ success: true });
});

// Change admin password
app.post('/api/admin/change-password', auth, (req, res) => {
  const { current, newPass } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE id=?').get(req.admin.id);
  if (!bcrypt.compareSync(current, admin.password)) return res.status(400).json({ error: 'Current password incorrect' });
  db.prepare('UPDATE admins SET password=? WHERE id=?').run(bcrypt.hashSync(newPass, 10), req.admin.id);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  PDF Receipt Generator
// ═══════════════════════════════════════════════════════════════════════════════
function sendReceiptPDF(d, res) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Receipt-${d.receipt_id}.pdf"`);
  doc.pipe(res);

  const W = doc.page.width;
  const navy = '#1a1f4e', gold = '#c9a84c', lightGold = '#f5e6c8';

  // Header band
  doc.rect(0, 0, W, 130).fill(navy);
  doc.fillColor(gold).fontSize(18).font('Helvetica-Bold')
     .text('KRRISHNA DHWARKA FOUNDATION BHARAT', 50, 28, { align: 'center', width: W - 100 });
  doc.fillColor(lightGold).fontSize(11).font('Helvetica')
     .text('शिक्षा का प्रकाश  |  Illuminating Education Across Bharat', 50, 56, { align: 'center', width: W - 100 });
  doc.fillColor(gold).fontSize(9)
     .text('Email: info@krrishnadhwarkafoundation.org  |  Web: www.krrishnadhwarkafoundation.org', 50, 80, { align: 'center', width: W - 100 });

  // Status badge
  const status = d.payment_status === 'completed' ? 'PAID' : d.payment_status.toUpperCase();
  const badgeColor = d.payment_status === 'completed' ? '#28a745' : '#dc3545';
  doc.rect(W - 110, 100, 70, 22).fill(badgeColor);
  doc.fillColor('#fff').fontSize(10).font('Helvetica-Bold').text(status, W - 108, 106, { width: 66, align: 'center' });

  // Title
  doc.fillColor(navy).fontSize(20).font('Helvetica-Bold').text('DONATION RECEIPT', 50, 148, { align: 'center', width: W - 100 });
  doc.strokeColor(gold).lineWidth(2).moveTo(50, 175).lineTo(W - 50, 175).stroke();

  // Two-column details
  const rows = [
    ['Receipt No.', d.receipt_id, 'Date', new Date(d.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
    ['Donor Name', d.donor_name, 'Email', d.donor_email],
    ['Phone', d.donor_phone || 'N/A', 'PAN', d.donor_pan || 'N/A'],
    ['Purpose', d.purpose || 'General Donation', 'Payment Mode', 'Online (Razorpay)'],
    ['Transaction ID', d.razorpay_payment_id || 'N/A', 'Order ID', d.razorpay_order_id || 'N/A'],
  ];

  let y = 190;
  doc.font('Helvetica').fontSize(10);
  rows.forEach(([l1, v1, l2, v2]) => {
    doc.fillColor(navy).font('Helvetica-Bold').text(l1 + ':', 60, y, { width: 100 });
    doc.fillColor('#333').font('Helvetica').text(v1, 165, y, { width: 180 });
    doc.fillColor(navy).font('Helvetica-Bold').text(l2 + ':', 360, y, { width: 80 });
    doc.fillColor('#333').font('Helvetica').text(v2, 445, y, { width: 110 });
    y += 24;
  });

  if (d.address) {
    doc.fillColor(navy).font('Helvetica-Bold').text('Address:', 60, y, { width: 100 });
    doc.fillColor('#333').font('Helvetica').text(d.address, 165, y, { width: 390 });
    y += 24;
  }

  y += 10;

  // Amount box
  doc.rect(60, y, W - 120, 70).fill(navy);
  doc.fillColor(lightGold).fontSize(12).font('Helvetica-Bold').text('DONATION AMOUNT', 70, y + 10, { width: W - 140, align: 'center' });
  doc.fillColor(gold).fontSize(28).font('Helvetica-Bold')
     .text('₹ ' + parseFloat(d.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }), 70, y + 28, { width: W - 140, align: 'center' });
  y += 82;

  const words = numToWords(Math.floor(d.amount));
  doc.fillColor('#555').fontSize(10).font('Helvetica-Oblique')
     .text('(' + words + ' Rupees Only)', 60, y, { width: W - 120, align: 'center' });
  y += 28;

  // Divider
  doc.strokeColor(gold).lineWidth(1).moveTo(60, y).lineTo(W - 60, y).stroke();
  y += 14;

  // 80G note
  doc.rect(60, y, W - 120, 44).fill('#fffbf0');
  doc.strokeColor(gold).lineWidth(1).rect(60, y, W - 120, 44).stroke();
  doc.fillColor('#666').fontSize(8.5).font('Helvetica')
     .text('This donation may be eligible for tax exemption under Section 80G of the Income Tax Act, 1961. Please retain this receipt for tax purposes. This is a computer-generated receipt and does not require a physical signature.', 68, y + 7, { width: W - 136, align: 'justify' });
  y += 58;

  // Signature section
  doc.fillColor(navy).fontSize(10).font('Helvetica-Bold').text('For Krrishna Dhwarka Foundation Bharat', W - 250, y, { width: 190, align: 'center' });
  doc.strokeColor(navy).lineWidth(1).moveTo(W - 240, y + 40).lineTo(W - 60, y + 40).stroke();
  doc.fillColor(navy).fontSize(9).font('Helvetica').text('Authorised Signatory', W - 230, y + 45, { width: 170, align: 'center' });

  // Footer
  const footerY = doc.page.height - 50;
  doc.rect(0, footerY - 15, W, 65).fill(navy);
  doc.fillColor(gold).fontSize(9).font('Helvetica-Bold')
     .text('KRRISHNA DHWARKA FOUNDATION BHARAT  |  शिक्षा का प्रकाश', 50, footerY - 5, { align: 'center', width: W - 100 });
  doc.fillColor(lightGold).fontSize(8).font('Helvetica')
     .text('Thank you for your generous contribution towards education and empowerment.', 50, footerY + 10, { align: 'center', width: W - 100 });

  doc.end();
}

function numToWords(n) {
  if (n === 0) return 'Zero';
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function conv(x) {
    if (x < 20) return ones[x];
    if (x < 100) return tens[Math.floor(x/10)] + (x%10 ? ' '+ones[x%10] : '');
    if (x < 1000) return ones[Math.floor(x/100)]+' Hundred'+(x%100?' '+conv(x%100):'');
    if (x < 100000) return conv(Math.floor(x/1000))+' Thousand'+(x%1000?' '+conv(x%1000):'');
    if (x < 10000000) return conv(Math.floor(x/100000))+' Lakh'+(x%100000?' '+conv(x%100000):'');
    return conv(Math.floor(x/10000000))+' Crore'+(x%10000000?' '+conv(x%10000000):'');
  }
  return conv(n);
}

// ─── SPA fallbacks ────────────────────────────────────────────────────────────
app.get('/admin', (req, res) => res.redirect('/admin/'));
app.get('/admin/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html')));

app.listen(PORT, () => {
  console.log(`\n🏛  Krrishna Dhwarka Foundation running at http://localhost:${PORT}`);
  console.log(`🔑  Admin panel: http://localhost:${PORT}/admin/`);
  console.log(`👤  Login: admin / admin123\n`);
});
