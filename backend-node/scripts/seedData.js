/**
 * Seed Script - Initial admin user and sample products
 * Run: node scripts/seedData.js  (or auto-runs on first server start)
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const SAMPLE_PRODUCTS = [
  {
    title: 'Jungle To-Do Colouring Book',
    description:
      'Explore the wild jungle! 48 pages of animals, trees and jungle scenes to colour. Packed with fun to-do activities that develop fine motor skills. Perfect for young explorers aged 4–8.',
    price: 299,
    image_url:
      'https://static.prod-images.emergentagent.com/jobs/cd5f40a9-651f-4209-9bc2-941d75259399/images/10666c02c5ff6dc3e38051b2a564e4775eaac646994a1ec8b6255159114be80b.png',
    category: 'colouring-book',
    age_range: '4-8 years',
    pages_count: 48,
    is_active: true,
  },
  {
    title: 'Space Adventures To-Do Book',
    description:
      'Blast off with astronauts, rockets and planets! 64 pages combining vibrant colouring with engaging space-themed to-do tasks. A must-have for young astronomers aged 5–10.',
    price: 349,
    image_url:
      'https://static.prod-images.emergentagent.com/jobs/cd5f40a9-651f-4209-9bc2-941d75259399/images/7d777bedd0731939b82fa71f254874306cff1316dab1376bf10242b89d45bc94.png',
    category: 'colouring-book',
    age_range: '5-10 years',
    pages_count: 64,
    is_active: true,
  },
  {
    title: 'Dinosaur Friends To-Do Book',
    description:
      'Travel back in time with T-Rex and friends! 48 pages of prehistoric scenes with creative colouring activities. Every dino lover aged 3–7 will be thrilled!',
    price: 299,
    image_url:
      'https://static.prod-images.emergentagent.com/jobs/cd5f40a9-651f-4209-9bc2-941d75259399/images/ec0440a7a1c265d030e2b55a3b179e45314ee80b5efd702bd9cab1209f3ddc87.png',
    category: 'colouring-book',
    age_range: '3-7 years',
    pages_count: 48,
    is_active: true,
  },
  {
    title: 'Magical Forest To-Do Book',
    description:
      'Enter a world of fairies, unicorns and enchanted forests! 64 pages of whimsical illustrations combined with creative tasks that spark imagination in children aged 4–9.',
    price: 349,
    image_url:
      'https://images.unsplash.com/photo-1612539466809-8be5e4e01256?w=400&q=80',
    category: 'colouring-book',
    age_range: '4-9 years',
    pages_count: 64,
    is_active: true,
  },
  {
    title: 'Ocean Wonders To-Do Book',
    description:
      'Dive deep with colourful fish, dolphins and coral reefs! 48 pages of underwater adventures packed with sea-themed activities for curious young minds aged 3–8.',
    price: 299,
    image_url:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    category: 'colouring-book',
    age_range: '3-8 years',
    pages_count: 48,
    is_active: true,
  },
  {
    title: 'Animals & Nature To-Do Book',
    description:
      'From lions to butterflies — 96 pages of detailed animal illustrations and nature scenes with engaging activities. The ultimate book for curious young naturalists aged 6–12.',
    price: 399,
    image_url:
      'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&q=80',
    category: 'colouring-book',
    age_range: '6-12 years',
    pages_count: 96,
    is_active: true,
  },
];

/**
 * Main seed function - idempotent (safe to run multiple times)
 */
const seedData = async (connectFirst = false) => {
  try {
    if (connectFirst) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected for seeding');
    }

    // Seed admin user
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@kalambooks.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Kalam@2024';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Kalam Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      console.log('Admin user already exists');
    }

    // Seed products (only if none exist)
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(SAMPLE_PRODUCTS);
      console.log(`${SAMPLE_PRODUCTS.length} sample products seeded`);
    } else {
      console.log(`Products already exist (${productCount}), skipping seed`);
    }

    if (connectFirst) {
      await mongoose.connection.close();
      console.log('Seeding complete. Connection closed.');
      process.exit(0);
    }
  } catch (error) {
    console.error('Seeding error:', error);
    if (connectFirst) process.exit(1);
  }
};

// Run directly: node scripts/seedData.js
if (require.main === module) {
  seedData(true);
} else {
  module.exports = seedData;
}
