# NovaPack — Premium Custom Packaging Platform

A modern, fully-featured e-commerce platform for custom packaging. Built with React 19 + Vite + Tailwind CSS on the frontend and Express.js + MongoDB on the backend. Features a live 3D box configurator, full authentication, admin panel with image upload, mobile-responsive design, and a polished multi-page storefront.

**Live URL:** https://novapack-custom-box.vercel.app

---

## Features

### Authentication & Social Login

- **Google Identity Services** — Fully integrated "Continue with Google" using `@react-oauth/google`. Supports real account selection, profile data extraction (name, email, avatar), and session persistence.
- **JWT Authentication** — Standard email/password login and registration with encrypted password storage.

### Premium UI/UX (Fully Responsive)

- **Floating Glassmorphism Navbar** — Sophisticated "pod" style navbar that appears on scroll with backdrop blur. Automatically switches to a standard solid bar on mobile for optimal usability.
- **Admin Dashboard** — Mobile-optimized data tables with horizontal scrolling and touch-friendly navigation.
- **Enhanced Micro-Animations** — Premium button hover effects, slide-up fills, and interactive scaling throughout the site.
- **3D Configurator** — Stacked layout on mobile for easy navigation between the preview and the configuration steps.

### Storefront (Mobile-Responsive)

- **Home Page** — Hero, stats bar, trending products slider, materials showcase, how-it-works steps, testimonials, inspiration gallery, CTA sections
- **Products Page** — Card grid with dynamic categories (synced with admin-added products), search, sidebar filter on desktop and drawer on mobile. Click any card to open full-spec QuickView modal
- **Industries Page** — Industry cards with packaging solutions per vertical (Food & Beverage, Cosmetics, E-commerce, Apparel, Electronics, Cannabis & CBD)
- **Contact Page** — Contact form with validation, info cards, OpenStreetMap embed, FAQ accordion
- **All text** uses justified layout throughout the site for consistent typography

### Custom Box Configurator

- 5-step accordion: Box Type → Dimensions & Quantity → Material → Print & Finish → Artwork Upload
- Real-time 3D preview with orbit controls and auto-rotation (React Three Fiber)
- Artwork upload (PDF, AI, EPS, PNG, PSD) with drag-and-drop; preview applied to 3D model
- SVG dieline download
- Live price calculation (size × quantity × add-ons)
- **Physical Sample Request** — Opens address form modal (name, email, phone, full delivery address). Saves as a sample quote in the admin panel and shows confirmation toast
- Pre-fills automatically when navigating from any product or industry card

### User Account

- Registration & Login with JWT auth
- **Profile Dashboard** with tabs: Overview, Orders, Quotes, Saved Designs, Addresses, Settings
- Saved Designs — restore complete box configuration in the configurator

### Admin Panel (`/admin`)

Login: `admin@novapack.com` / `Admin@123`

- **Dashboard** — Revenue, orders, pending, customer KPI cards + recent orders table
- **Products Management** — Add/edit/delete products. Full form includes:
  - Image upload (file upload — PNG/JPG/WebP, stored as base64)
  - Name, slug (auto-generated), category, description, price
  - Box Type, Material, Finish, Dimensions range, Min. Order Qty
  - Available Add-ons (quick-select chips + custom tag input)
  - Featured toggle
- **Industries Management** — Add/edit/delete industries with image upload and description
- **Orders Management** — Status updates, tracking numbers, CSV export
- **Users Management** — Role assignment, loyalty points, CSV export
- **Quotes & Sample Requests** — Unified view of both custom quotes and physical sample requests, showing delivery address, type badge, and reply/price modal
- **Analytics** — Orders by status, revenue trends, user growth charts
- **Mobile sidebar** — Collapsible sidebar with hamburger menu on small screens

### Additional

- Global **Cart Drawer** with quantity controls
- **Favourites** system with heart icons
- **Product Quick View** modal — full specs (box type, material, finish, dimensions, min. order, add-ons), mobile responsive (stacks vertically on small screens)
- **Tawk.to Live Chat** integration
- **Back to Top** button

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS 3 + Vanilla CSS |
| Auth (Social) | `@react-oauth/google` + `jwt-decode` |
| Routing | React Router DOM 7 |
| Icons | Lucide React |
| 3D Preview | Three.js · React Three Fiber · React Three Drei |
| State | React Context API |
| Backend | Express.js + Node.js |
| Database | MongoDB (Mongoose) |
| Auth (Local) | JWT (bcryptjs) |
| Deployment | Vercel (frontend + serverless API) |

---

## Brand Colors

| Token | Hex | Usage |
|---|---|---|
| Primary | `#1A4D2E` | Forest green — headers, buttons, nav |
| Accent | `#C8860A` | Gold — prices, CTAs, highlights |
| Background | `#F5F2ED` | Warm parchment — page backgrounds |
| Surface | `#FFFFFF` | Cards, modals |
| Footer BG | `#0F2E1A` | Deep green — footer |

---

## Quick Start

### Frontend

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

### Backend (local)

```bash
cd server
npm install
# Create .env with MONGODB_URI and JWT_SECRET
npm run dev
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

Create `server/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## Admin Access

| Field | Value |
|---|---|
| Email | `admin@novapack.com` |
| Password | `Admin@123` |

Auto-seeded on first server start if not present in the database.

---

## Key File Locations

| File | Purpose |
|---|---|
| `src/pages/Home.jsx` | Full home page with all sections |
| `src/pages/Products.jsx` | Products catalog — dynamic categories, mobile sidebar |
| `src/pages/Industries.jsx` | Industries catalog |
| `src/pages/Admin.jsx` | Admin panel — image upload, full product/industry forms, mobile sidebar |
| `src/pages/CustomBox.jsx` | 3D box configurator + sample request modal |
| `src/pages/Contact.jsx` | Contact form + OpenStreetMap embed |
| `src/pages/Profile.jsx` | User dashboard with saved designs |
| `src/components/ProductQuickView.jsx` | Full-spec modal, mobile responsive |
| `src/components/LiveChat.jsx` | Tawk.to integration |
| `src/context/AuthContext.jsx` | Auth + user state |
| `src/context/CartContext.jsx` | Global cart |
| `server/routes/admin.js` | Admin CRUD routes (products, industries, orders, quotes) |
| `server/routes/users.js` | User profile, orders, quotes, sample requests |
| `server/models/Product.js` | Product schema (includes boxType, material, finish, dims, minQty, addons) |
| `server/models/User.js` | User schema (orders, quotes with type + deliveryAddress, savedDesigns) |

---

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/products` | Products catalog |
| `/industries` | Industries catalog |
| `/about` | About Us |
| `/custom-box` | Box Configurator |
| `/success-stories` | Inspiration & Design Lookbook |
| `/contact-us` | Contact + Map |
| `/how-it-works` | Process page |
| `/blog` | Blog |
| `/faqs` | FAQ page |
| `/favourites` | Saved favourites |
| `/login` | Login |
| `/register` | Register |
| `/profile` | User dashboard (auth required) |
| `/admin` | Admin panel (admin role required) |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/users/profile` | Get current user profile |
| POST | `/api/users/quotes` | Submit quote or sample request |
| GET | `/api/admin/products` | List all products (admin) |
| POST | `/api/admin/products` | Create product (admin) |
| PUT | `/api/admin/products/:id` | Update product (admin) |
| DELETE | `/api/admin/products/:id` | Delete product (admin) |
| GET | `/api/admin/industries` | List all industries (admin) |
| POST | `/api/admin/industries` | Create industry (admin) |
| GET | `/api/admin/quotes` | List all quotes + sample requests (admin) |
| PUT | `/api/admin/quotes/:userId/:quoteId` | Reply to quote (admin) |
| GET | `/api/content/products` | Public products list |
