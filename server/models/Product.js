const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Kitchen',
        'Sports & Outdoors',
        'Toys & Games',
        'Beauty & Personal Care',
        'Automotive',
        'Health & Household',
        'Groceries',
        'Baby',
        'Pet Supplies',
        'Office Products',
      ],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    specifications: {
      type: Map,
      of: String,
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    // For search optimization (DSA concept - Trie/Indexing)
    searchKeywords: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance (DBMS concept)
productSchema.index({ name: 'text', description: 'text', searchKeywords: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdAt: -1 });

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function () {
  return this.price - (this.price * this.discount) / 100;
});

// Pre-save middleware to generate search keywords
productSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isModified('description')) {
    const keywords = [
      ...this.name.toLowerCase().split(' '),
      ...this.description.toLowerCase().split(' '),
      this.brand?.toLowerCase(),
      this.category.toLowerCase(),
    ].filter(Boolean);
    this.searchKeywords = [...new Set(keywords)];
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
