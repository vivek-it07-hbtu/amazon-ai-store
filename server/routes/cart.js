const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// In-memory cart storage (in production, use Redis or database)
const carts = new Map();

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = carts.get(userId) || { items: [], total: 0 };

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, name, price, quantity, image } = req.body;

    let cart = carts.get(userId) || { items: [], total: 0 };

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity, image });
    }

    // Calculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    carts.set(userId, cart);

    res.json({
      success: true,
      message: 'Item added to cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update cart item quantity
router.put('/update/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    let cart = carts.get(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    carts.set(userId, cart);

    res.json({
      success: true,
      message: 'Cart updated',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = carts.get(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    carts.set(userId, cart);

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    carts.set(userId, { items: [], total: 0 });

    res.json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
