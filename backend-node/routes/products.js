/**
 * Product Routes
 */
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);                    // GET /api/products - active products
router.get('/all', protect, adminOnly, getAllProducts); // GET /api/products/all - admin only
router.get('/:id', getProductById);              // GET /api/products/:id

// Protected admin routes
router.post('/', protect, adminOnly, createProduct);         // POST /api/products
router.put('/:id', protect, adminOnly, updateProduct);       // PUT /api/products/:id
router.delete('/:id', protect, adminOnly, deleteProduct);    // DELETE /api/products/:id

module.exports = router;
