# Running Locally

## 1. Install dependencies

```bash
# Root (frontend)
npm install

# Backend
cd server && npm install && cd ..
```

## 2. Create .env file
Create a file called `.env` in the project root with these keys
(get the actual values from Vercel → Environment Variables):

```env
MONGODB_URI=<your MongoDB Atlas URI>
JWT_SECRET=<your JWT secret>
STRIPE_SECRET_KEY=<your Stripe secret key>
VITE_API_URL=/api
VITE_STRIPE_PUBLISHABLE_KEY=<your Stripe publishable key>
VITE_TAWK_PROPERTY_ID=69f748e548ca411c3004e297
VITE_TAWK_WIDGET_ID=1jnmv9gk6
```

## 3. Run everything with ONE command

```bash
npm run dev:all
```

This starts both at once:
- Backend  → http://localhost:5000
- Frontend → http://localhost:3000

Vite automatically proxies `/api/*` requests to the backend.

## 4. Open in browser
Visit: **http://localhost:3000**

Admin login: `admin@designcustombox.com` / `Admin@123`
