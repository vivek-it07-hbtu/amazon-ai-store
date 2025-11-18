const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// AI Sentiment Analysis
function analyzeSentiment(text) {
  const positiveWords = ['great', 'excellent', 'amazing', 'love', 'best', 'perfect', 'wonderful', 'awesome', 'fantastic', 'good', 'nice', 'recommend', 'quality', 'satisfied', 'happy'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor', 'disappointing', 'useless', 'broken', 'defective', 'waste', 'disappointed', 'horrible', 'unhappy'];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    const matches = lowerText.match(regex);
    if (matches) positiveCount += matches.length;
  });

  negativeWords.forEach(word => {
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    const matches = lowerText.match(regex);
    if (matches) negativeCount += matches.length;
  });

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort('-createdAt')
      .limit(50);

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create a review
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Analyze sentiment
    const sentiment = analyzeSentiment(comment + ' ' + (title || ''));

    const review = await Review.create({
      productId,
      userId: req.user.id,
      userName: `${req.user.firstName || 'User'}`,
      rating,
      title,
      comment,
      sentiment,
      verifiedPurchase: Math.random() > 0.3, // 70% chance of verified purchase for demo
      helpfulVotes: 0,
    });

    // Update product rating
    const reviews = await Review.find({ productId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      'ratings.average': parseFloat(avgRating.toFixed(1)),
      'ratings.count': reviews.length,
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Vote helpful on a review
router.post('/:reviewId/helpful', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get sentiment summary for a product
router.get('/product/:productId/sentiment', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });

    const sentimentCount = {
      positive: reviews.filter(r => r.sentiment === 'positive').length,
      neutral: reviews.filter(r => r.sentiment === 'neutral').length,
      negative: reviews.filter(r => r.sentiment === 'negative').length,
    };

    const total = reviews.length;
    const sentimentPercentage = {
      positive: total > 0 ? Math.round((sentimentCount.positive / total) * 100) : 0,
      neutral: total > 0 ? Math.round((sentimentCount.neutral / total) * 100) : 0,
      negative: total > 0 ? Math.round((sentimentCount.negative / total) * 100) : 0,
    };

    res.json({
      success: true,
      count: sentimentCount,
      percentage: sentimentPercentage,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
