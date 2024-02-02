const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    uniqueID: String,
    name: String,
    mno: String,
    email: String,
  title: String,
  workshop: String,
  moc: String,
  price: String,
  moc: String,
  link: String,
  is_payment:{
    type:Number,
    default:0
},
  scheduledDateTimes: [Date],
  created_at: { type: Date, default: Date.now }

});


module.exports =  mongoose.model('Booking',bookSchema);