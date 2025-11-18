const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    images: [String],
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
