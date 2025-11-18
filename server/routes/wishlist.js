const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');

// Wishlist Schema (MongoDB)
const wishlistSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    index: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id })
      .populate('productId')
      .sort({ addedAt: -1 });

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add item to wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      userId: req.user.id,
      productId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
      });
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      productId,
    });

    const populated = await Wishlist.findById(wishlistItem._id).populate('productId');

    res.status(201).json({
      success: true,
      message: 'Added to wishlist',
      wishlistItem: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Remove item from wishlist
router.delete('/:id', auth, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist',
      });
    }

    res.json({
      success: true,
      message: 'Removed from wishlist',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      userId: req.user.id,
      productId: req.params.productId,
    });

    res.json({
      success: true,
      inWishlist: !!item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
