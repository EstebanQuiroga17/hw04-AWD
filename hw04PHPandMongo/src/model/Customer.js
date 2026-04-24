const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Customer', CustomerSchema);