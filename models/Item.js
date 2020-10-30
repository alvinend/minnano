const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: String,
  imagelink: String,
  price: Number,
  stock: Number,
  categoryid: {
    type: String,
    required: true
  }
})

module.exports = User = mongoose.model('items', ItemSchema);
