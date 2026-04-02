/**
 * Product Model - Kalam Colouring Books
 */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image_url: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'colouring-book',
      trim: true,
    },
    age_range: {
      type: String,
      default: '3-10 years',
      trim: true,
    },
    pages_count: {
      type: Number,
      default: 48,
      min: [1, 'Pages count must be at least 1'],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
productSchema.index({ is_active: 1, createdAt: -1 });

// Map _id to id in JSON responses (frontend compatibility)
productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Product', productSchema);
