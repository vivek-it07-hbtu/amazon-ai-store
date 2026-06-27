const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { sequelize } = require('./config/database');

// Load environment variables
dotenv.config();

// Verify critical environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET is not defined in environment variables!');
  console.error('Please check your .env file');
  process.exit(1);
}

console.log('✅ JWT_SECRET configured');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connections
const connectDatabases = async () => {
  try {
    // Connect to PostgreSQL/SQLite (required - handles users and orders)
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ PostgreSQL/SQLite connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL/SQLite connection error:', error);
    process.exit(1);
  }

  try {
    // Connect to MongoDB (optional - handles products)
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('⚠️ MONGODB_URI not set, skipping MongoDB connection');
    }
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed (products may not load):', error.message);
    console.warn('   Server will continue without MongoDB. Set MONGODB_URI in .env to enable.');
  }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/recommendations', require('./routes/recommendations'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Amazon Clone API is running' });
});

// Test auth endpoint
const { auth } = require('./middleware/auth');
app.get('/api/test-auth', auth, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Authentication working',
    user: req.user,
    jwtConfigured: !!process.env.JWT_SECRET
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabases();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;
