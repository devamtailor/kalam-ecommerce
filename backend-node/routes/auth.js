/**
 * Auth Routes
 */
const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me (protected)
router.get('/me', protect, getMe);

module.exports = router;

router.get('/create-admin', async (req, res) => {
  const bcrypt = require('bcryptjs');
  const User = require('../models/User');

  const existing = await User.findOne({ email: 'admin@kalambooks.com' });

  if (existing) {
    return res.send('Admin already exists');
  }

  const hashedPassword = await bcrypt.hash('Kalam@2024', 12);

  await User.create({
    name: "Admin",
    email: "admin@kalambooks.com",
    password: hashedPassword,
    role: "admin"
  });

  res.send('Admin created');
});