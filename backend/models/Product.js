const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    day: { type: Number },
    month: { type: Number },
    year: { type: Number }
}, {
    collection: 'products'
});

module.exports = mongoose.model('Product', productSchema);
