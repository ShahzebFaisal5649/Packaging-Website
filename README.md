# NovaPack — Premium Custom Packaging Platform

A modern, fully-featured e-commerce frontend for a custom packaging business. Built with React 19, Vite, and Tailwind CSS. Features an interactive 3D box configurator, full auth flow, live chat (Tawk.to), real map integration, and a polished multi-page storefront.

---

## Features

### Storefront
- **Home Page** — Hero, stats bar, trending products slider, materials & finishes showcase, how-it-works steps, customer testimonials, inspiration gallery, and CTA section
- **Products Page** — Clean card grid (image + name + price + button). Click any card to open a full-spec QuickView modal. Filter by category, search by keyword
- **Industries Page** — Same clean card system with industry-specific pricing. Covers Food & Beverage, Cosmetics, E-commerce, Apparel, Electronics, Cannabis & CBD
- **Inspiration / Design Lookbook** — Filterable gallery + trending-this-season cards with full spec details (material, finish, dimensions, add-ons). Clicking any trending card navigates to the Custom Box configurator with specs pre-filled
- **Contact Page** — Contact form with validation, info cards, live OpenStreetMap embed, FAQ accordion

### Custom Box Configurator
- 5-step accordion: Box Type → Dimensions & Quantity → Material → Print & Finish → Artwork Upload
- **Design Name field** — give your design a name before saving; appears in your profile
- Real-time 3D preview powered by `@react-three/fiber` with orbit controls and auto-rotation
- Artwork upload (PDF, AI, EPS, PNG, PSD) with drag-and-drop; preview applied to 3D model
- SVG dieline download
- Live price calculation (size × quantity × add-ons)
- Pre-fills automatically when navigating from any product card, industry card, or trending card

### User Account
- Registration & Login with password-strength indicator
- Mock Google OAuth login
- **Profile Dashboard** with tabs:
  - **Overview** — stats, loyalty points/tier, edit profile
  - **Orders** — order history with status badges and detail modal
  - **Quotes** — quote history with detail modal
  - **Saved Designs** — shows box type, dimensions, material, finish, add-on count. **Edit** restores the complete configuration in the configurator (no more reset!)
  - **Addresses** — add/edit/delete shipping addresses
  - **Settings** — notifications, password change, account deletion

### Additional
- Global **Cart Drawer** with quantity controls, persisted in localStorage
- **Favourites** system with heart icons across all product/industry cards
- **Product Quick View** modal with full specs: box type, material, finish, dimensions, min. order, add-ons
- **Tawk.to Live Chat** integration (replace `TAWK_PROPERTY_ID` in `LiveChat.jsx`)
- **Back to Top** floating button
- Responsive on all screen sizes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS 3 + inline styles |
| Routing | React Router DOM 7 |
| Icons | Lucide React |
| 3D Preview | Three.js · React Three Fiber · React Three Drei |
| Animations | AOS (Animate on Scroll) |
| State | React Context API (Auth, Cart, Favourites, Toast, Modal) |
| Persistence | localStorage (no backend required) |

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

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Admin Access

An admin account is seeded automatically in localStorage on first load:

| Field | Value |
|---|---|
| Email | `admin@packaging.com` |
| Password | `Admin@123` |

---

## Tawk.to Live Chat Setup

1. Sign up for free at [tawk.to](https://www.tawk.to)
2. Create a property for your website
3. Copy your **Property ID** (e.g. `641xxxxxxxxxxxxxx`)
4. Open `src/components/LiveChat.jsx`
5. Replace `YOUR_PROPERTY_ID` with your real Property ID
6. Tawk.to renders its own chat widget automatically

---

## Key File Locations

| File | Purpose |
|---|---|
| `src/pages/Home.jsx` | Full home page with all sections |
| `src/pages/Products.jsx` | Products catalog with clean card design |
| `src/pages/Industries.jsx` | Industries catalog |
| `src/pages/SuccessStories.jsx` | Inspiration lookbook + trending cards |
| `src/pages/CustomBox.jsx` | 3D box configurator with name field + saved design fix |
| `src/pages/Contact.jsx` | Contact form + OpenStreetMap embed |
| `src/pages/Profile.jsx` | User dashboard with saved designs tab |
| `src/components/LiveChat.jsx` | Tawk.to integration |
| `src/components/ProductQuickView.jsx` | Full-spec modal for product cards |
| `src/components/Footer.jsx` | Footer with logo fix |
| `src/context/AuthContext.jsx` | Auth + user state (localStorage) |
| `src/context/CartContext.jsx` | Global cart |
| `src/data/index.js` | Shared data (FAQs, blog posts, pricing table) |

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

## Backend Integration

All context files in `src/context/` are structured for easy migration to a REST API. Replace `localStorage` calls with `fetch`/`axios` calls to your Express/MongoDB backend. Look for `// TODO: Replace with API call` comments as migration points.
