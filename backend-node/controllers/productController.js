/**
 * Product Controller - CRUD for Kalam Colouring Books
 */
const Product = require('../models/Product');

/**
 * GET /api/products
 * Get all active products (public)
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ is_active: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

/**
 * GET /api/products/all
 * Get all products including inactive (admin only)
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

/**
 * GET /api/products/:id
 * Get single product by ID (public)
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

/**
 * POST /api/products
 * Create a new product (admin only)
 */
const createProduct = async (req, res) => {
  const { title, description, price, image_url, category, age_range, pages_count, is_active } = req.body;

  if (!title || !description || !price || !image_url) {
    return res.status(400).json({ message: 'Title, description, price, and image URL are required' });
  }

  try {
    const product = await Product.create({
      title,
      description,
      price: parseFloat(price),
      image_url,
      category: category || 'colouring-book',
      age_range: age_range || '3-10 years',
      pages_count: parseInt(pages_count) || 48,
      is_active: is_active !== undefined ? is_active : true,
    });

    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Failed to create product' });
  }
};

/**
 * PUT /api/products/:id
 * Update a product (admin only)
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, price: req.body.price ? parseFloat(req.body.price) : undefined },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Failed to update product' });
  }
};

/**
 * DELETE /api/products/:id
 * Delete a product (admin only)
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = { getProducts, getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
