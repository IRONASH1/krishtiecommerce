const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
