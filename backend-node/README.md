# Kalam Shop - Backend API

Express.js REST API for the Kalam Children's Colour Books ecommerce platform.

## Tech Stack
- Node.js + Express.js
- MongoDB Atlas (via Mongoose)
- JWT Authentication
- bcryptjs (password hashing)

## Deploy to Render

### Step 1: Push to GitHub
Push the `backend-node/` folder to a GitHub repository.

### Step 2: Create Render Web Service
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: kalam-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables in Render
```
PORT=10000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kalam_shop
JWT_SECRET=your-64-character-random-secret
ADMIN_EMAIL=admin@kalambooks.com
ADMIN_PASSWORD=YourSecurePassword123
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### Step 4: First Deployment
The server automatically seeds:
- Admin user (using ADMIN_EMAIL + ADMIN_PASSWORD)
- 6 sample colouring book products

---

## API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/auth/me` | Admin | Get current user |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | Get active products |
| GET | `/api/products/all` | Admin | Get all products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Public | Place new order |
| GET | `/api/orders` | Admin | Get all orders |
| GET | `/api/orders/:id` | Public | Get order details |
| PUT | `/api/orders/:id/status` | Admin | Update order status |

---

## Local Development

```bash
cd backend-node
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas URI
npm run dev
```

## Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kalambooks.com","password":"Kalam@2024"}'
```

## Future: Razorpay Integration
The order controller includes comments marking exactly where to add Razorpay payment logic.
See `controllers/orderController.js` → `createOrder` function.
