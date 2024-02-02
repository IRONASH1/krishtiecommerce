const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  uniqueID: String,
  totalPrice: Number,
  product: {
    type: String,
    ref: 'paintingProduct',
  },
      quantity: Number,
      is_verified:{
        type:Number,
        default:0
    },
   created_at: { type: Date, default: Date.now }
});

const Wish = mongoose.model('Wish', wishSchema);

module.exports = Wish;
