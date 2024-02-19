const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Ensure uniqueness of category names
  }
});

module.exports = mongoose.model('Category', categorySchema);