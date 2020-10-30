const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Role List
// 1. Admin
// 2. Staff

// Create Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

module.exports = User = mongoose.model('users', UserSchema);
