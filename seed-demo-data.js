// One-time script: seeds demo donations + inquiries so the admin dashboard
// (stats, monthly chart, inquiry donut, payment history) looks populated.
// Run with:  node --experimental-sqlite seed-demo-data.js
const path = require('path');
const { DatabaseSync: Database } = require('node:sqlite');
const db = new Database(path.join(__dirname, 'foundation.db'));

const rid = (n) => 'KDF-DEMO-' + n;

// donor_name, email, phone, pan, amount, purpose, status, 'YYYY-MM-DD HH:MM:SS'
const donations = [
  ['Aarav Sharma',   'aarav.sharma@gmail.com',   '+91 98200 11223', 'ABCPS1234A', 2100,  'Education Support',   'completed', '2026-01-08 10:24:00'],
  ['Priya Nair',     'priya.nair@outlook.com',   '+91 99401 55678', 'BNZPN5678B', 5000,  'Scholarship Fund',    'completed', '2026-01-22 16:10:00'],
  ['Rohan Mehta',    'rohan.mehta@gmail.com',    '+91 98330 44556', 'CDLPM9012C', 1000,  'General Donation',    'completed', '2026-02-05 09:05:00'],
  ['Sneha Iyer',     'sneha.iyer@yahoo.com',     '+91 90030 22110', 'DKMPI3456D', 11000, 'Healthcare Camp',     'completed', '2026-02-19 19:42:00'],
  ['Vikram Singh',   'vikram.singh@gmail.com',   '+91 97110 88990', 'EPQPS7890E', 500,   'General Donation',    'completed', '2026-03-03 12:30:00'],
  ['Ananya Gupta',   'ananya.gupta@gmail.com',   '+91 98910 33445', 'FRSPG2345F', 2100,  'Women Empowerment',   'completed', '2026-03-15 14:55:00'],
  ['Karthik Reddy',  'karthik.reddy@gmail.com',  '+91 95001 66778', 'GTUPR6789G', 25000, 'Scholarship Fund',    'completed', '2026-03-28 11:18:00'],
  ['Meera Joshi',    'meera.joshi@hotmail.com',  '+91 98671 99001', 'HVWPJ0123H', 5000,  'Education Support',   'completed', '2026-04-10 08:47:00'],
  ['Arjun Patel',    'arjun.patel@gmail.com',    '+91 99250 12345', 'IXYPP4567I', 1500,  'Skill Development',   'completed', '2026-04-24 21:09:00'],
  ['Divya Menon',    'divya.menon@gmail.com',    '+91 90370 56789', 'JZAPM8901J', 10000, 'Healthcare Camp',     'completed', '2026-05-06 13:33:00'],
  ['Sanjay Kumar',   'sanjay.kumar@gmail.com',   '+91 98180 67890', 'KBCPK2345K', 3100,  'Cultural Programme',  'completed', '2026-05-20 17:21:00'],
  ['Neha Verma',     'neha.verma@gmail.com',     '+91 97170 78901', 'LDEPV6789L', 2100,  'General Donation',    'completed', '2026-06-02 10:02:00'],
  ['Rahul Das',      'rahul.das@gmail.com',      '+91 98300 89012', 'MFGPD0123M', 7500,  'Education Support',   'completed', '2026-06-09 15:48:00'],
  ['Pooja Rao',      'pooja.rao@gmail.com',      '+91 99020 90123', 'NHIPR4567N', 500,   'General Donation',    'pending',   '2026-06-13 09:14:00'],
  ['Aditya Nair',    'aditya.nair@gmail.com',    '+91 90080 01234', 'OJKPN8901O', 1000,  'General Donation',    'pending',   '2026-06-14 18:37:00'],
];

// name, email, phone, subject, message, is_read, 'date'
const inquiries = [
  ['Ishaan Kapoor', 'ishaan.kapoor@gmail.com', '+91 98201 23456', 'General Inquiry',       'I came across your foundation and would love to know more about the work you do in rural schools.', 1, '2026-05-30 11:20:00'],
  ['Tara Bose',     'tara.bose@gmail.com',     '+91 99401 34567', 'Donation Query',        'I made a donation last week but have not received the 80G receipt on email yet. Could you please help?', 0, '2026-06-10 09:45:00'],
  ['Manish Agarwal','manish.a@gmail.com',      '+91 98330 45678', 'Volunteer',             'I am a college student in Delhi and would like to volunteer on weekends for your education programmes.', 1, '2026-06-01 16:05:00'],
  ['Kavya Pillai',  'kavya.pillai@gmail.com',  '+91 90030 56789', 'Partnership',           'Our company runs a CSR programme and we are interested in partnering with you for school supplies drives.', 0, '2026-06-12 14:30:00'],
  ['Rohit Saxena',  'rohit.saxena@gmail.com',  '+91 97110 67890', 'Programme Information',  'Could you share more details about the scholarship eligibility and how students can apply?', 1, '2026-05-18 10:12:00'],
  ['Anjali Desai',  'anjali.desai@gmail.com',  '+91 98910 78901', 'Volunteer',             'I am a retired teacher and would be happy to help with your digital literacy classes. Please get in touch.', 0, '2026-06-14 08:50:00'],
  ['Suresh Babu',   'suresh.babu@gmail.com',   '+91 95001 89012', 'Media/Press',           'I am a journalist working on a story about grassroots education NGOs and would like to feature your work.', 1, '2026-04-29 13:40:00'],
  ['Lakshmi Menon', 'lakshmi.menon@gmail.com', '+91 98671 90123', 'General Inquiry',       'Do you accept donations of books and stationery in addition to monetary contributions?', 1, '2026-06-05 19:22:00'],
];

let dAdded = 0, iAdded = 0;
const existing = new Set(db.prepare("SELECT receipt_id FROM donations WHERE receipt_id LIKE 'KDF-DEMO-%'").all().map(r => r.receipt_id));

donations.forEach((d, i) => {
  const receipt = rid(1000 + i);
  if (existing.has(receipt)) return;
  const [name, email, phone, pan, amount, purpose, status, created] = d;
  db.prepare(`INSERT INTO donations
    (receipt_id, razorpay_order_id, razorpay_payment_id, donor_name, donor_email, donor_phone, donor_pan, amount, purpose, address, payment_status, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(receipt,
      'order_DEMO' + (1000 + i),
      status === 'completed' ? 'pay_DEMO' + (1000 + i) : null,
      name, email, phone, pan, amount, purpose, 'India', status, created);
  dAdded++;
});

// Only seed inquiries if we have very few (avoid piling up on re-runs)
const inqCount = db.prepare('SELECT COUNT(*) c FROM inquiries').get().c;
if (inqCount < 3) {
  inquiries.forEach(([name, email, phone, subject, message, read, created]) => {
    db.prepare('INSERT INTO inquiries (name,email,phone,subject,message,is_read,created_at) VALUES (?,?,?,?,?,?,?)')
      .run(name, email, phone, subject, message, read, created);
    iAdded++;
  });
}

console.log(`Inserted ${dAdded} donations and ${iAdded} inquiries.`);
db.close();
