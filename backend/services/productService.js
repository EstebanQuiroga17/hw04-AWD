const Product = require('../models/Product');

const getAllProducts = async () => {
    return await Product.find();
};

const calculateTotal = async (products) => {
    if (products && Array.isArray(products) && products.length > 0) {
        return products.reduce((acc, product) => {
            const price = parseFloat(product.price) || 0;
            return acc + price;
        }, 0);
    }
    const dbProducts = await Product.find().limit(5);
    return dbProducts.reduce((acc, prod) => acc + (prod.price || 0), 0);
};

const calculateIVA = async (name, priceInput) => {
    let price = parseFloat(priceInput);
    if ((isNaN(price) || !price) && name) {
        const product = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (product) price = product.price;
    }
    if (isNaN(price)) return null;
    return price * 0.15;
};

const calculateDaysLeft = async (name, dayInput, monthInput, yearInput) => {
    let day = parseInt(dayInput);
    let month = parseInt(monthInput);
    let year = parseInt(yearInput);

    if ((!day || !month || !year) && name) {
        const product = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (product) {
            day = product.day;
            month = product.month;
            year = product.year;
        }
    }

    if (!day || !month || !year) return null;

    const today = new Date();
    const expirationDate = new Date(year, month - 1, day);
    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = {
    getAllProducts,
    calculateTotal,
    calculateIVA,
    calculateDaysLeft
};
