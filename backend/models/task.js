const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
  type: String,
  required: true
  },
  category: {
    type: String,
    required: true
  },
  description: String
});

module.exports = mongoose.model('Task', taskSchema);
