# Vercel Deployment Instructions

This project is configured for seamless deployment on Vercel as a full-stack MERN application.

## 1. Prerequisites
- A Vercel account.
- The project pushed to a GitHub/GitLab/Bitbucket repository.

## 2. Configuration Files
The following files have been added/updated for Vercel:
- `vercel.json`: Handles routing for the frontend and backend.
- `package.json`: Merged dependencies to ensure Vercel installs everything needed for the serverless functions.
- `server/index.js`: Optimized for serverless execution.

## 3. Environment Variables
You **MUST** set the following environment variables in the Vercel Dashboard (Settings > Environment Variables):

### Backend Variables (Serverless)
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure string for signing tokens.
- `STRIPE_SECRET_KEY`: Your Stripe secret key (`sk_test_...`).
- `RESEND_API_KEY`: Your Resend API key for emails.
- `GEMINI_API_KEY`: (Optional) For AI features.
- `GROQ_API_KEY`: (Optional) For AI features.

### Frontend Variables (Build Time)
- `VITE_API_URL`: Set this to `/api` (this is already the default in the code).
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (`pk_test_...`).
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
- `VITE_TAWK_PROPERTY_ID`: (Optional) For Tawk.to chat.
- `VITE_TAWK_WIDGET_ID`: (Optional) For Tawk.to chat.

## 4. Deployment Steps
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import your repository.
3. Vercel should automatically detect the Vite project.
4. Expand **"Environment Variables"** and add the variables listed above.
5. Click **"Deploy"**.

## 5. Troubleshooting
- **API 404s**: Ensure `vercel.json` is in the root directory.
- **DB Connection Issues**: Ensure your MongoDB Atlas IP Whitelist allows access from "everywhere" (0.0.0.0/0) or uses a VPC.
- **Build Failures**: Check the Vercel logs. Ensure all dependencies are in the root `package.json`.
