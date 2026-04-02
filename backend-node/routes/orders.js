/**
 * Order Routes
 */
const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/', createOrder);              // POST /api/orders - place order
router.get('/:id', getOrderById);          // GET /api/orders/:id - order confirmation

// Protected admin routes
router.get('/', protect, adminOnly, getOrders);                              // GET /api/orders - all orders
router.put('/:id/status', protect, adminOnly, updateOrderStatus);           // PUT /api/orders/:id/status

module.exports = router;
