# 📦 Design Custom Box
### *Luxury Custom Packaging & Production Platform*

Design Custom Box is a high-performance, production-ready MERN stack application designed for the luxury packaging industry. It combines a sophisticated user experience with powerful backend management, 3D visualization, and secure authentication.

---

## 💎 Premium Features

### 🎨 Design & UX
- **3D Box Configurator**: Real-time interactive visualization of custom box styles (Mailer, Rigid, Sleeve, etc.).
- **Mobile-First Luxury UI**: Glassmorphism effects, smooth micro-animations, and a locked responsive layout to prevent unwanted scaling.
- **Dynamic Headers**: Context-aware navigation with luxury typography and optimized mobile centering.
- **Vibrant Hero Sections**: High-vibrancy, luxury-tier imagery across all landing and secondary pages.

### 🔐 Security & Integrity
- **Official Google OAuth2**: Secure "Login with Google" integration for friction-less onboarding.
- **JWT Authentication**: Secure session management and protected API routes.
- **Admin Command Center**: Role-based access control (RBAC) with full visibility into orders, users, and industry trends.
- **Data Hardening**: Input sanitization and secure environment configuration.

### 💼 E-commerce Engine
- **Full Checkout Flow**: Integrated shopping cart with persistence and secure checkout simulation.
- **Favourites System**: User-specific collections for saving and comparing premium designs.
- **Live Chat Integration**: Branded fallback and Tawk.to support for real-time customer assistance.
- **Newsletter Engine**: Functional "Stay in the Loop" subscription system.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Framer Motion, Tailwind CSS, Lucide Icons, Swiper.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | Google OAuth 2.0, JWT (JSON Web Tokens) |
| **Payment** | Stripe (Infrastructure ready) |
| **Deployment** | Vercel (Frontend), Node.js production server |

---

## 📂 Project Structure

```text
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Page Level Components
│   │   ├── context/        # Global State (Auth, Cart, Favs)
│   │   ├── services/       # API Services (Axios/Fetch)
│   │   └── assets/         # Branding & Imagery
├── server/                 # Backend Node.js API
│   ├── models/             # Mongoose Schemas (User, Product, Subscriber)
│   ├── routes/             # API Endpoints
│   ├── middleware/         # Auth & Security Middlewares
│   └── index.js            # Entry Point
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas)

### 2. Environment Configuration
Create a `.env` file in both the `root` and `server` directories:

**Frontend (.env):**
```env
VITE_GOOGLE_CLIENT_ID=your_google_id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000/api
VITE_TAWK_PROPERTY_ID=your_id
```

**Backend (server/.env):**
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
```

### 3. Installation
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

### 4. Running the App
```bash
# Start both Frontend and Backend
npm run dev
```

---

## 📞 Support & Contact

For technical support or partnership inquiries:

- **Phone**: (913) 228-2682
- **Email**: support@designcustombox.com
- **HQ**: 5532 Big River Dr, The Colony, Texas, US 75056

---

**Developed & Maintained by NextStac**  
*Empowering brands through premium packaging solutions.*
