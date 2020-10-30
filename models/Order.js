const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
  cart: [{
    item: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  }],
  // label = card number (C8) or table number (T2)
  label: String
})

module.exports = User = mongoose.model('orders', OrderSchema);
