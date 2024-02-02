
// models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String,
  image1: String,
  image2: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('customizationProduct', productSchema);
