# 📦 Design Custom Box

### *The Ultimate Luxury Custom Packaging Platform*

[![Live Site](https://img.shields.io/badge/Live%20Site-novapack--custom--box.vercel.app-brightgreen?style=flat-square&logo=vercel)](https://novapack-custom-box.vercel.app)
[![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js%20%2B%20MongoDB-blue?style=flat-square)](#)
[![AI](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-orange?style=flat-square&logo=google)](#)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](https://opensource.org/licenses/MIT)

> Design Custom Box is a production-grade, full-stack e-commerce and configurator platform for a premium US-based custom packaging company. It features a real-time 3D box configurator, an AI-powered chat assistant, a comprehensive admin panel, and transactional email support.

---

## 🌐 Live Deployment

| Environment | URL |
|---|---|
| **Production** | [https://novapack-custom-box.vercel.app](https://novapack-custom-box.vercel.app) |
| **Admin Panel** | [https://novapack-custom-box.vercel.app/admin](https://novapack-custom-box.vercel.app/admin) |
| **GitHub Repo** | [ShahzebFaisal5649/Custom-Box-Website-2](https://github.com/ShahzebFaisal5649/Custom-Box-Website-2) |

**Admin Credentials (Seeded):**
- Email: `Designcustombox@gmail.com`
- Password: `Admin@123`

---

## ✨ Features

### 🎨 Premium UI/UX
- **Brand Identity**: Forest Green (`#1A4D2E`) + Imperial Gold (`#C8860A`) palette
- **Glassmorphism & Micro-animations**: Framer Motion powered transitions throughout
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Mobile Drawer**: Accessible close button, smooth slide-in navigation

### 🛠️ 3D Box Configurator
- Real-time 3D visualization using Three.js / React Three Fiber
- Supports Mailer, Rigid, Sleeve, Shipping, Display, and more
- Dynamic dieline SVG export for production-ready design files
- Material, finish, and dimension customization

### 🤖 Intelligent AI Chat Assistant
- Powered by **Google Gemini 2.0 Flash**
- Full product catalog and company knowledge injected via system instructions
- Automatically falls back to static data if DB is unavailable — always online
- Renders rich markdown responses (bold, bullets) in the chat UI
- Quick-prompt chips, typing animation, conversation reset
- Graceful error fallback with contact information

### 🛒 E-Commerce & Cart
- Full shopping cart with quantity controls and persistent state
- Cart Drawer with smooth slide-in animation and accessible close button
- Checkout flow with Stripe payment integration
- Guest checkout supported

### 🔐 Authentication & Security
- JWT-based authentication with secure HTTP-only token storage
- Google OAuth 2.0 login integration
- Forgot Password / Reset Password with transactional email via Gmail SMTP
- Role-based access control (user vs admin)

### 📊 Admin Panel
- **Dashboard**: Revenue, orders, customers KPIs with charts
- **Orders**: Full order lifecycle management with status updates
- **Users**: View and manage all registered customers
- **Products**: Full CRUD with image upload and 3D spec fields
- **Industries**: Manage industry categories with rich content
- **Quotes**: Review custom quote requests
- **Messages**: Read contact form submissions
- **Subscribers**: Newsletter subscriber management with CSV export
- **Analytics**: Revenue charts, user growth, fulfillment pulse
- Mobile-responsive sidebar with hamburger menu and close button
- "Back to Website" link directly in the sidebar

### 📧 Transactional Email
- Nodemailer configured with Gmail SMTP + App Passwords
- Password reset emails with secure tokenized links
- Contact email: `Designcustombox@gmail.com`

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + Vite |
| **Styling** | Tailwind CSS + Vanilla CSS |
| **Animations** | Framer Motion + AOS |
| **3D Engine** | Three.js + @react-three/fiber + @react-three/drei |
| **Icons** | Lucide React |
| **AI** | Google Gemini 2.0 Flash (`@google/generative-ai`) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | JWT + Google OAuth 2.0 (`@react-oauth/google`) |
| **Payments** | Stripe |
| **Email** | Nodemailer (Gmail SMTP) |
| **Deployment** | Vercel (Serverless + Static) |

---

## 📂 Project Structure

```text
Custom-Box-Website-2/
├── src/                        # React Frontend (Vite)
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Responsive navigation with mobile drawer
│   │   ├── Footer.jsx          # Footer with contact + newsletter
│   │   ├── CustomChat.jsx      # Gemini AI chat widget
│   │   ├── CartDrawer.jsx      # Slide-in shopping cart
│   │   └── ...
│   ├── pages/                  # Route-level page components
│   │   ├── Admin.jsx           # Full admin panel (2100+ lines)
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── CustomBox.jsx       # 3D configurator
│   │   ├── Checkout.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ...
│   ├── context/                # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── FavouritesContext.jsx
│   │   └── ToastContext.jsx
│   └── services/
│       └── api.js              # Centralized fetch wrapper
├── server/                     # Node.js + Express Backend
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Industry.js
│   │   └── ...
│   ├── routes/                 # API route handlers
│   │   ├── auth.js             # Login, register, password reset
│   │   ├── admin.js            # Protected admin endpoints
│   │   ├── chat.js             # Gemini AI chat endpoint
│   │   ├── content.js          # Public product/industry content
│   │   └── payment.js          # Stripe checkout
│   ├── utils/
│   │   └── email.js            # Nodemailer transporter
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   └── index.js                # Express server entry point
├── vercel.json                 # Vercel deployment config
├── .env                        # Frontend env vars (Vite)
├── server/.env                 # Backend env vars (Node)
└── README.md
```

---

## ⚡ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey))
- Gmail account with App Password enabled

### 1. Clone & Install

```bash
git clone https://github.com/ShahzebFaisal5649/Custom-Box-Website-2.git
cd Custom-Box-Website-2

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Configure Environment Variables

**Frontend (`/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

**Backend (`/server/.env`):**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/designcustombox
JWT_SECRET=your_secure_jwt_secret
EMAIL_USER=Designcustombox@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
```

### 3. Run Locally

```bash
# Start both frontend (port 3000) and backend (port 5000)
npm run dev:all

# Or run separately:
npm run dev          # Frontend only
npm run dev:server   # Backend only
```

---

## 🚀 Vercel Deployment

The project is pre-configured for Vercel via `vercel.json`.

**Required Environment Variables in Vercel Dashboard:**

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your JWT signing secret |
| `EMAIL_USER` | `Designcustombox@gmail.com` |
| `EMAIL_PASS` | Gmail App Password (16 chars) |
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `CLIENT_URL` | `https://novapack-custom-box.vercel.app` |
| `NODE_ENV` | `production` |

> **Important:** The `VITE_*` env vars are set in `vercel.json` and do not need to be added manually.

---

## 📞 Contact & Support

| Channel | Details |
|---|---|
| **Email** | [Designcustombox@gmail.com](mailto:Designcustombox@gmail.com) |
| **Phone** | (913) 228-2682 |
| **Address** | 5532 Big River Dr, The Colony, Texas, US 75056 |
| **Hours** | Mon–Fri 9am–6pm EST · Sat 10am–2pm EST |

---

*Built with ❤️ for Design Custom Box*
