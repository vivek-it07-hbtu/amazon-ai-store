const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config({ path: '../.env' }); // Adjust path if needed

const makeRealisticINR = (inrPrice) => {
  if (inrPrice < 500) {
    return Math.ceil(inrPrice / 10) * 10 - 1;
  }
  return Math.ceil(inrPrice / 100) * 100 - 1;
};

async function updatePrices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/amazon_clone');
    console.log('Connected to MongoDB');
    
    const products = await Product.find({});
    let count = 0;
    
    for (const p of products) {
      // If price is less than 5000, it's likely still in USD
      if (p.price < 5000) {
        const realisticInr = makeRealisticINR(p.price * 83);
        p.price = realisticInr;
        await p.save();
        count++;
      }
    }
    
    console.log(`Successfully updated ${count} products to realistic INR prices!`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating prices:', error);
    process.exit(1);
  }
}

updatePrices();
