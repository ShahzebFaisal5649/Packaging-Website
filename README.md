# 📦 Design Custom Box
### *The Ultimate Luxury Custom Packaging Platform*

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://www.mongodb.com/mern-stack)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](http://makeapullrequest.com)

Design Custom Box is a production-grade, full-stack application engineered for premium packaging manufacturers. It features a high-fidelity 3D box configurator, luxury-tier UI/UX, and a robust administrative backend.


---

## ✨ Core Experience

### 🎨 Elite Visual Design
- **Luxury Aesthetic**: Curated Forest Green (`#1A4D2E`) and Imperial Gold (`#C8860A`) palette.
- **Glassmorphism**: Modern, translucent UI elements with smooth backdrop blurs.
- **Micro-Animations**: Framer Motion powered transitions that respond to user intent.

### 🛠️ Interactive Engineering
- **3D Real-time Configurator**: Precision visualization for Mailer, Rigid, and Sleeve boxes.
- **Dynamic Dieline Generation**: Automatic SVG export for production-ready design files.
- **Human-Centric UX**: Optimized hit areas, centered mobile headers, and locked responsive scaling.

### 🔐 Enterprise Hardening
- **Official Google OAuth2**: Seamless, secure authentication using Google's production identity layer.
- **Admin Command Center**: Real-time dashboard for managing orders, products, and subscribers.
- **Newsletter Engine**: Fully functional automated subscription management.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS & Modern Vanilla CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion & AOS (Animate On Scroll)

### Backend
- **Engine**: Node.js & Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT & Google OAuth 2.0
- **Payments**: Stripe Infrastructure

---

## 📂 Project Architecture

```text
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Design System
│   │   ├── pages/          # Full-page Views
│   │   ├── context/        # State (Auth, Cart, Favs)
│   │   └── services/       # API Communications
├── server/                 # Node.js Backend
│   ├── models/             # Schema Definitions
│   ├── routes/             # Controller Logic
│   └── index.js            # Server Entry
└── README.md
```

---

## ⚡ Setup & Deployment

### 1. Prerequisites
- Node.js v18+
- MongoDB Atlas Account

### 2. Quick Install
```bash
# Clone the repository
git clone https://github.com/ShahzebFaisal5649/Custom-Box-Website-2.git

# Install dependencies
npm install
cd server && npm install && cd ..
```

### 3. Environment Config
**Frontend (.env):**
```env
VITE_GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000/api
```

---

## 📞 Premium Support

For enterprise licensing, technical support, or partnership inquiries:

- **Official Phone**: (913) 228-2682
- **Support Email**: support@designcustombox.com
- **Headquarters**: 5532 Big River Dr, The Colony, Texas, US 75056

---

**Developed with ❤️ for Design Custom Box by NextStac**
