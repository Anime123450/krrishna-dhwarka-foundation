# Krrishna Dhwarka Foundation Bharat — Website

<p align="center">
  <img src="public/images/logo2.png" alt="Krrishna Dhwarka Foundation Bharat" width="220" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22%2B-339933?logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?logo=express" />
  <img src="https://img.shields.io/badge/Razorpay-Integrated-02042B?logo=razorpay&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Complete-brightgreen" />
</p>

This is a full-stack website I built as part of my internship for **Krrishna Dhwarka Foundation Bharat**, a charitable organization that works towards education and community welfare (*शिक्षा का प्रकाश* — Light of Education).

The task was to build a complete charity website from scratch — with a public-facing website, donation collection through Razorpay, automatic PDF receipts, and a full admin panel to manage everything.

---

## What I Built

The project has two parts — the public website that anyone can visit, and a private admin panel that only the foundation team uses.

**Public Website**

There are five pages. The home page has a banner slider where images are managed through the admin panel, along with sections about the foundation's mission, programs, and a donate button. The About page goes deeper into the story and values. The Certificates page shows all registration/award certificates uploaded by the admin. The Contact page has an inquiry form that goes straight into the admin panel. And the Donate page is where the actual payment happens.

**Admin Panel**

Accessible at `/admin/` with login. From here, the admin can:
- Read and manage all contact inquiries (mark read, delete)
- See all donations with full donor info, and download a PDF receipt for any payment
- Upload certificates (images or PDFs) that show up on the public certificates page
- Upload/manage home page banner images — activate, deactivate, or delete them
- Change the admin password

**Donation Flow**

When someone donates, they fill in their details (name, email, phone, PAN for 80G), pick an amount, and click pay. This creates a Razorpay order on the backend, opens the Razorpay popup, and after successful payment the signature is verified server-side. Then a PDF receipt is generated on the fly and downloaded automatically. The same receipt can be re-downloaded from the admin panel anytime.

---

## Running This Locally

You'll need **Node.js v22 or higher** — the project uses the built-in `node:sqlite` module that comes with Node 22, so there's no native database installation needed.

**1. Clone the repo**
```bash
git clone https://github.com/Anime123450/krrishna-dhwarka-foundation.git
cd krrishna-dhwarka-foundation
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Copy the example file:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Open `.env` and fill in your Razorpay test keys. You can get them for free from [dashboard.razorpay.com](https://dashboard.razorpay.com) → Settings → API Keys → Generate Test Key.

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

**4. Start the server**
```bash
npm start
```

The terminal will show:
```
🏛  Krrishna Dhwarka Foundation running at http://localhost:3000
🔑  Admin panel: http://localhost:3000/admin/
👤  Login: admin / admin123
```

**5. Open in browser**

- Website → `http://localhost:3000`
- Admin panel → `http://localhost:3000/admin/`

---

## Test Credentials

**Admin login**
- Username: `admin`
- Password: `admin123`

**Razorpay test card** (no real money, just for testing)
- Card: `4111 1111 1111 1111`
- Expiry: any future date
- CVV: `123`
- OTP: `1234`

---

## How to Check the Work

Here's the flow I'd suggest to see everything working:

1. Open the home page — check the nav, sections, footer, mobile responsiveness
2. Go to the Contact page → submit an inquiry form
3. Log into the admin panel → the inquiry appears under Inquiries
4. In admin, go to Banners → upload any image → go back to the home page and refresh — it shows in the slider
5. In admin, go to Certificates → upload a file → check the public Certificates page
6. Go to the Donate page → pick ₹500 → fill in any test details → click Pay → use the test card above
7. After payment, a PDF receipt downloads automatically
8. Back in admin under Donations, find that payment and click the PDF button — same receipt from admin side
9. Try the Settings page to change the admin password

---

## Tech Stack

I used Node.js with Express for the backend. For the database, I used the built-in `node:sqlite` module that ships with Node.js 22 — this means no external database setup needed, it just works. Razorpay handles payments and I verify the payment signature on the server before marking anything as completed. PDFKit generates the receipts. Multer handles file uploads. JWT + bcrypt handle admin authentication.

The frontend is plain HTML, CSS, and vanilla JavaScript — no React or any framework. The admin panel is a single-page app built entirely in one HTML file with inline JavaScript switching between sections. The design uses the foundation's navy blue and gold color scheme.

---

## Project Structure

```
krrishna-dhwarka-foundation/
├── server.js                  # All backend logic — routes, DB, auth, PDF
├── package.json
├── .env.example               # Copy this to .env and add your keys
│
└── public/
    ├── index.html             # Home page
    ├── about.html             # About Us
    ├── contact.html           # Contact + inquiry form
    ├── certificates.html      # Public certificates gallery
    ├── donate.html            # Donation + Razorpay payment
    ├── css/style.css          # All styling
    ├── js/main.js             # Shared JS (slider, cert loading)
    ├── images/logo.png        # Foundation logo
    ├── admin/index.html       # Complete admin panel (SPA)
    └── uploads/               # Files uploaded via admin
        ├── certificates/
        └── banners/
```

---

## API Overview

**Public routes** (no auth needed):
- `POST /api/inquiry` — submit contact form
- `GET /api/banners` — get active banners for home slider
- `GET /api/certificates` — get all certificates
- `POST /api/donation/create-order` — create Razorpay order
- `POST /api/donation/verify` — verify payment signature
- `GET /api/receipt/:id` — download PDF receipt

**Admin routes** (JWT required):
- `POST /api/admin/login` — login, returns JWT token
- `GET /api/admin/stats` — dashboard numbers
- `GET/PATCH/DELETE /api/admin/inquiries` — manage inquiries
- `GET /api/admin/donations` — view all donations
- `GET /api/admin/receipt/:id` — download any receipt
- `POST/DELETE /api/admin/certificates` — manage certificates
- `GET/POST/PATCH/DELETE /api/admin/banners` — manage banners
- `POST /api/admin/change-password` — update admin password

---

## Notes

- The `.env` file is in `.gitignore` so your Razorpay keys are never uploaded to GitHub
- The database (`foundation.db`) is also gitignored — it gets created automatically the first time you run the server
- Uploaded files in `public/uploads/` are gitignored too since they'd make the repo unnecessarily large
- The admin password is hashed with bcrypt before being stored in the database

---

*Built by Animesh Sharma — Internship project for Krrishna Dhwarka Foundation Bharat*
