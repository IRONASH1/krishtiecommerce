
// models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  workshop: String,
  description: String,
  price: String,
  moc: String,
  image1: String,
  link: String,
  scheduledDateTimes: [Date],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('workshopProduct', productSchema);
