const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: String,
  imagelink: String
});

module.exports = User = mongoose.model('categories', CategorySchema);
