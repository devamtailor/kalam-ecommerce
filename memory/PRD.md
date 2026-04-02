# Kalam Children's Colour Books - Product Requirements Document

## Overview
Full-stack ecommerce web application for Kalam, a children's brand selling To-Do Colouring Books.
Built with React + FastAPI + MongoDB (preview) and Node.js/Express + MongoDB Atlas (production).

## Last Updated: February 2026

---

## Architecture

### Preview Environment (Running)
- Frontend: React (port 3000, hot reload)
- Backend: FastAPI/Python (port 8001, supervisor-managed)
- Database: MongoDB (local, DB: test_database)

### Production Deployment (Ready)
- Frontend: React → **Netlify** (`frontend/public/_redirects` included)
- Backend: Node.js/Express → **Render** (`backend-node/` folder, `npm start`)
- Database: **MongoDB Atlas** (MONGO_URI env var)

### Deployment Docs
- See `/app/DEPLOYMENT.md` for step-by-step deployment guide
- See `/app/backend-node/README.md` for backend API reference

---

## Brand Design
- Primary: #F57B2C (buttons, CTAs)
- Secondary: #2DAEBB (sections, cards accents)
- Accent: #FBD40B (badges, highlights)
- Background Section: #2390B6 (hero, footer, CTA banners)
- Text: #8A6A9F (headings), #4A3556 (body)
- Fonts: Fredoka (headings), Nunito (body)

---

## Implemented Features

### User-Facing
- [x] Home page with hero banner, feature cards, featured products, brand story, CTA section
- [x] Product listing page with search filter and sort by price
- [x] Product detail page with quantity selector and Add to Cart
- [x] Cart with quantity controls, remove items, free shipping threshold (₹499)
- [x] Checkout form (name, phone, address, city, pincode + notes)
- [x] Cash on Delivery payment (COD) - only option currently
- [x] Order confirmation with order number (KLM-XXXX), status tracker
- [x] Responsive design across all pages
- [x] Fully branded with Kalam colors and logo

### Admin Panel (/adminkalam)
- [x] Secure JWT login
- [x] Product management (Add/Edit/Delete) with modal form
- [x] View all products with status (active/inactive)
- [x] View all orders sorted by date
- [x] Update order status (pending/processing/shipped/delivered/cancelled)
- [x] Logout functionality

### Backend APIs
- [x] GET /api/products - public product listing
- [x] GET /api/products/all - admin listing (all)
- [x] GET /api/products/:id - single product
- [x] POST /api/products - create (admin)
- [x] PUT /api/products/:id - update (admin)
- [x] DELETE /api/products/:id - delete (admin)
- [x] POST /api/orders - place order
- [x] GET /api/orders - list orders (admin)
- [x] GET /api/orders/:id - order detail
- [x] PUT /api/orders/:id/status - update status (admin)
- [x] POST /api/auth/login - admin login
- [x] GET /api/auth/me - current admin

### Database
- [x] Product schema (title, description, price, image, age_range, pages_count, is_active)
- [x] Order schema (customer details, items, total, status, order_number)
- [x] Admin user schema (in 'admins' collection, bcrypt password)
- [x] Auto-seeded with 6 sample products on first run

---

## Deployment Readiness
- [x] `frontend/public/_redirects` for Netlify SPA routing
- [x] `netlify.toml` for Netlify build configuration
- [x] Node.js backend (`backend-node/`) ready for Render
- [x] `.env.example` with all required variables documented
- [x] DEPLOYMENT.md with step-by-step guide
- [x] Razorpay integration hooks in orderController.js

---

## Credentials
- Admin Email: admin@kalambooks.com
- Admin Password: Kalam@2024
- Admin Panel: /adminkalam

---

## P1 Backlog (Next Steps)
- [ ] Razorpay payment gateway integration
- [ ] Product image upload (vs URL entry)
- [ ] Customer order tracking by phone number
- [ ] Email notifications (order placed, shipped)
- [ ] Product categories/filters
- [ ] Discount codes / coupon system
- [ ] Product reviews and ratings

## P2 Backlog
- [ ] Brute force protection on admin login
- [ ] Restrict CORS to specific origins in production
- [ ] Customer login/accounts
- [ ] Order analytics dashboard
- [ ] Inventory management
- [ ] WhatsApp order notifications
