# Kalam Shop - Full Deployment Guide

## Architecture
- **Frontend**: React → Netlify
- **Backend**: Node.js/Express → Render
- **Database**: MongoDB Atlas

---

## Step 1: MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (M0 - Free Tier)
3. Create a database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow all) for Render
5. Click "Connect" → "Connect your application" → Copy the URI:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/kalam_shop?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Render

1. Push the `backend-node/` folder to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect GitHub → Select repository
4. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `PORT` | `10000` |
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://...` (your Atlas URI) |
| `JWT_SECRET` | Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `ADMIN_EMAIL` | `admin@kalambooks.com` |
| `ADMIN_PASSWORD` | `YourSecurePassword!` |
| `FRONTEND_URL` | `https://your-netlify-app.netlify.app` |

6. Deploy → Note your backend URL: `https://kalam-backend.onrender.com`

---

## Step 3: Deploy Frontend to Netlify

1. Update `/frontend/.env`:
   ```
   REACT_APP_BACKEND_URL=https://kalam-backend.onrender.com
   ```
2. Push `frontend/` to GitHub
3. Go to [app.netlify.com](https://app.netlify.com) → New site from Git
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
5. Add Environment Variable:
   - `REACT_APP_BACKEND_URL` = `https://kalam-backend.onrender.com`
6. Deploy!

> The `frontend/public/_redirects` file handles React Router on Netlify.

---

## Step 4: Update CORS on Backend

Once Netlify URL is known, update `FRONTEND_URL` in Render environment to your Netlify URL.

---

## Admin Panel
- URL: `https://your-netlify-app.netlify.app/adminkalam`
- Email: `admin@kalambooks.com` (or your ADMIN_EMAIL)
- Password: Your `ADMIN_PASSWORD`

---

## Future: Razorpay Integration
See `backend-node/controllers/orderController.js` for integration hooks.
Required env variables to add:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
