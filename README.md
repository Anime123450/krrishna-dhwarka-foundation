# Krrishna Dhwarka Foundation Bharat — Official Website

> **Internship Project** | Full-Stack Charity Website with Admin Panel & Razorpay Payment Integration

![Node.js](https://img.shields.io/badge/Node.js-v22%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen)

---

## About the Project

A fully functional charity/NGO website built for **Krrishna Dhwarka Foundation Bharat** (motto: *शिक्षा का प्रकाश* — Light of Education).

Built as an internship task. The website includes a public-facing website, a complete donation flow with Razorpay payment gateway, instant PDF receipt generation, and a full admin panel — all with zero external database dependencies (uses Node.js 22's built-in SQLite).

---

## Live Features

### Public Website
| Page | Description |
|------|-------------|
| **Home** | Hero banner slider (managed from admin), mission/vision, programs, stats, donate CTA |
| **About Us** | Foundation story, values, programs detail |
| **Certificates** | Public gallery of certificates uploaded by admin |
| **Contact / Inquiry** | Inquiry form — submissions go to admin panel |
| **Donate** | Full Razorpay payment flow with instant PDF receipt download |

### Admin Panel (`/admin/`)
| Section | Features |
|---------|----------|
| **Dashboard** | Live stats — total donations, payment count, inquiry count, certificates |
| **Inquiries** | View all, mark read/unread, delete |
| **Donations** | Full payment history with status, download PDF receipt for any payment |
| **Certificates** | Upload (JPG/PNG/PDF), view, delete |
| **Banners** | Upload home page hero banners, activate/deactivate, sort order, delete |
| **Settings** | Change admin password |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js v22+, Express.js |
| **Database** | SQLite via Node.js built-in `node:sqlite` (no install needed) |
| **Payments** | Razorpay Payment Gateway |
| **PDF Generation** | PDFKit |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **File Uploads** | Multer |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (no frameworks) |

> **Zero native dependencies** — runs on any Windows/Mac/Linux with Node.js 22+

---

## How to Run Locally (for reviewers)

### Prerequisites
- **Node.js v22 or higher** — [Download here](https://nodejs.org)
- A free Razorpay account — [Sign up here](https://razorpay.com) (for payment testing)

### Step 1 — Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/krrishna-dhwarka-foundation.git
cd krrishna-dhwarka-foundation
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Configure environment
Copy `.env.example` to `.env`:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Open `.env` and add your Razorpay test keys:
```env
PORT=3000
JWT_SECRET=any-secret-string-here

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

> **Note:** You can get free test keys from [Razorpay Dashboard](https://dashboard.razorpay.com) → Settings → API Keys → Generate Test Key. No real money is involved in test mode.

### Step 4 — Start the server
```bash
npm start
```

You should see:
```
🏛  Krrishna Dhwarka Foundation running at http://localhost:3000
🔑  Admin panel: http://localhost:3000/admin/
👤  Login: admin / admin123
```

### Step 5 — Open in browser
| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Public website |
| `http://localhost:3000/admin/` | Admin panel |

---

## Test Credentials

### Admin Panel
| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

### Razorpay Test Payment (card)
| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g., `12/26`) |
| CVV | `123` |
| OTP | `1234` |

---

## How to Review / Test the Work

Follow this sequence to see all features in action:

### 1. Test the public website
- Visit `http://localhost:3000` — home page with nav, sections, footer
- Visit `/about.html` — about page
- Visit `/contact.html` — fill and submit the inquiry form

### 2. Test the admin panel
- Go to `http://localhost:3000/admin/` → Login with `admin / admin123`
- **Dashboard** — see live stats
- **Inquiries** — the inquiry you just submitted will appear here, mark it as read
- **Banners** — upload any JPG image → it will appear in the home page hero slider
- **Certificates** — upload a JPG/PNG/PDF → it appears on `/certificates.html`

### 3. Test the donation + payment receipt
- Go to `http://localhost:3000/donate.html`
- Select an amount (e.g., ₹500)
- Fill in Name, Email, Phone, PAN (any values for testing)
- Click **Proceed to Pay**
- In Razorpay popup → use the test card above
- After payment → a PDF receipt downloads automatically
- Back in admin panel → **Donations** → click **PDF** button to download receipt from admin side

### 4. Verify PDF receipt
The generated PDF includes:
- Foundation header with name and branding
- Receipt ID, donor name, email, phone, PAN
- Purpose of donation
- Amount in digits and words (Indian number system: Lakh, Crore)
- Payment status badge
- 80G tax exemption note
- Transaction ID from Razorpay

---

## Project Structure

```
krrishna-dhwarka-foundation/
├── server.js                   # Express server — all routes, DB, auth, PDF
├── package.json
├── .env.example                # Environment variable template
│
└── public/                     # All static files served directly
    ├── index.html              # Home page
    ├── about.html              # About Us
    ├── contact.html            # Contact + Inquiry form
    ├── certificates.html       # Public certificates gallery
    ├── donate.html             # Donation form + Razorpay integration
    │
    ├── css/
    │   └── style.css           # Complete shared stylesheet (~600 lines)
    │
    ├── js/
    │   └── main.js             # Shared JS — slider, cert loading, utilities
    │
    ├── images/
    │   └── logo.png            # Foundation logo (place here)
    │
    ├── admin/
    │   └── index.html          # Full admin SPA (single-page app, ~700 lines)
    │
    └── uploads/
        ├── certificates/       # Certificate files uploaded via admin
        └── banners/            # Banner images uploaded via admin
```

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/inquiry` | Submit contact inquiry |
| `GET` | `/api/banners` | Get active banners |
| `GET` | `/api/certificates` | Get all certificates |
| `POST` | `/api/donation/create-order` | Create Razorpay order |
| `POST` | `/api/donation/verify` | Verify payment signature |
| `GET` | `/api/receipt/:receiptId` | Download PDF receipt |

### Admin (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin login → returns JWT |
| `GET` | `/api/admin/stats` | Dashboard statistics |
| `GET` | `/api/admin/inquiries` | All inquiries |
| `PATCH` | `/api/admin/inquiries/:id/read` | Mark inquiry as read |
| `DELETE` | `/api/admin/inquiries/:id` | Delete inquiry |
| `GET` | `/api/admin/donations` | All donation records |
| `GET` | `/api/admin/receipt/:id` | Download receipt PDF (admin) |
| `POST` | `/api/admin/certificates` | Upload certificate |
| `DELETE` | `/api/admin/certificates/:id` | Delete certificate |
| `GET` | `/api/admin/banners` | All banners (including inactive) |
| `POST` | `/api/admin/banners` | Upload banner |
| `PATCH` | `/api/admin/banners/:id/toggle` | Toggle banner active status |
| `DELETE` | `/api/admin/banners/:id` | Delete banner |
| `POST` | `/api/admin/change-password` | Change admin password |

---

## Database Schema

The app auto-creates a SQLite database (`foundation.db`) on first run with these tables:

```sql
inquiries   — id, name, email, phone, subject, message, is_read, created_at
donations   — id, receipt_id, razorpay_order_id, razorpay_payment_id,
              donor_name, donor_email, donor_phone, donor_pan,
              amount, purpose, address, payment_status, created_at
certificates — id, title, description, filename, uploaded_at
banners      — id, title, filename, is_active, sort_order, uploaded_at
admins       — id, username, password (bcrypt hashed)
```

---

## Design

- **Color scheme:** Deep navy `#1a1f4e` + Gold `#c9a84c` — matching the foundation's official seal
- **Responsive:** Works on mobile, tablet, and desktop
- **No frameworks:** Pure HTML/CSS/JS — no React, Vue, or Bootstrap
- **Admin:** Full single-page application with JWT auth, built without any UI framework

---

## Free Deployment Options

To host this website for free:

### Option 1 — Render.com (Recommended)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect GitHub repo
4. Set environment variables (from `.env`)
5. Start command: `npm start`
6. Free URL: `https://your-app.onrender.com`

### Option 2 — Railway.app
1. Go to [railway.app](https://railway.app) → Deploy from GitHub
2. Add environment variables
3. Free tier includes $5 credit/month

> **Note on file uploads:** Free hosting tiers reset uploaded files on redeploy. For production, integrate [Cloudinary](https://cloudinary.com) (free tier) for persistent file storage.

---

## Internship Details

- **Task:** Build a complete charity website with admin panel and payment integration
- **Client:** Krrishna Dhwarka Foundation Bharat
- **Built by:** Animesh Sharma
- **Tech:** Full-stack Node.js — backend, frontend, database, payments, PDF generation

---

## License

MIT — free to use, modify, and distribute.
