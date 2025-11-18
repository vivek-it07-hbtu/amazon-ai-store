const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// AI-powered product recommendations based on collaborative filtering
router.get('/recommended/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const currentProduct = await Product.findById(productId);

    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find products in the same category
    const sameCategoryProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: productId },
      isActive: true,
    })
      .limit(20)
      .exec();

    // Calculate similarity scores based on:
    // 1. Price range similarity (30% weight)
    // 2. Rating similarity (30% weight)
    // 3. Same subcategory (40% weight)
    const scoredProducts = sameCategoryProducts.map((product) => {
      let score = 0;

      // Price similarity
      const priceDiff = Math.abs(product.price - currentProduct.price);
      const priceScore = Math.max(0, 1 - priceDiff / currentProduct.price);
      score += priceScore * 0.3;

      // Rating similarity
      const ratingDiff = Math.abs(
        product.ratings.average - currentProduct.ratings.average
      );
      const ratingScore = Math.max(0, 1 - ratingDiff / 5);
      score += ratingScore * 0.3;

      // Subcategory match
      if (product.subcategory === currentProduct.subcategory) {
        score += 0.4;
      }

      return { product, score };
    });

    // Sort by score and return top 6
    const recommendations = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.product);

    res.json({
      success: true,
      products: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Frequently bought together (based on similar price range and category)
router.get('/frequently-bought-together/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const currentProduct = await Product.findById(productId);

    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find complementary products
    // Logic: Find products with different subcategories but same category
    // and price range within 20-80% of current product
    const complementaryProducts = await Product.find({
      category: currentProduct.category,
      subcategory: { $ne: currentProduct.subcategory },
      price: {
        $gte: currentProduct.price * 0.2,
        $lte: currentProduct.price * 0.8,
      },
      _id: { $ne: productId },
      isActive: true,
      'ratings.average': { $gte: 4.0 }, // Only high-rated products
    })
      .limit(3)
      .sort('-ratings.average')
      .exec();

    res.json({
      success: true,
      products: complementaryProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Trending products (based on ratings and recent views)
router.get('/trending', async (req, res) => {
  try {
    const { limit = 12, category } = req.query;

    const query = { isActive: true, 'ratings.count': { $gte: 50 } };
    if (category) {
      query.category = category;
    }

    // Get trending products (high ratings + many reviews)
    const trendingProducts = await Product.find(query)
      .sort('-ratings.count -ratings.average')
      .limit(parseInt(limit))
      .exec();

    res.json({
      success: true,
      products: trendingProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Smart search with AI ranking
router.get('/smart-search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.json({ success: true, products: [] });
    }

    // Text search
    const searchResults = await Product.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .exec();

    res.json({
      success: true,
      products: searchResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Personalized recommendations (based on user's recent activity)
router.post('/personalized', async (req, res) => {
  try {
    const { recentlyViewed = [], limit = 12 } = req.body;

    if (recentlyViewed.length === 0) {
      // Return trending if no history
      const trending = await Product.find({ isActive: true })
        .sort('-ratings.average')
        .limit(parseInt(limit))
        .exec();

      return res.json({ success: true, products: trending });
    }

    // Get recently viewed products
    const viewedProducts = await Product.find({
      _id: { $in: recentlyViewed },
    });

    // Extract categories and price ranges
    const categories = [...new Set(viewedProducts.map((p) => p.category))];
    const avgPrice =
      viewedProducts.reduce((sum, p) => sum + p.price, 0) /
      viewedProducts.length;

    // Find similar products
    const recommendations = await Product.find({
      category: { $in: categories },
      price: {
        $gte: avgPrice * 0.5,
        $lte: avgPrice * 1.5,
      },
      _id: { $nin: recentlyViewed },
      isActive: true,
    })
      .sort('-ratings.average')
      .limit(parseInt(limit))
      .exec();

    res.json({
      success: true,
      products: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
