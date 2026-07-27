const productService = require('../services/productService');

const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const computeTotal = async (req, res) => {
    try {
        const { products } = req.body;
        const total = await productService.calculateTotal(products);
        res.json({ total });
    } catch (error) {
        console.error("Error computing total:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const computeIVA = async (req, res) => {
    try {
        const { name, price } = req.body;
        const iva = await productService.calculateIVA(name, price);
        if (iva === null) {
            return res.status(400).json({ error: 'Valid price or existing product name is required' });
        }
        res.json({ iva });
    } catch (error) {
        console.error("Error computing IVA:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const computeExpiration = async (req, res) => {
    try {
        const { name, day, month, year } = req.body;
        const daysLeft = await productService.calculateDaysLeft(name, day, month, year);
        if (daysLeft === null) {
            return res.status(400).json({ error: 'Valid expiration date or existing product name is required' });
        }
        res.json({ daysLeft });
    } catch (error) {
        console.error("Error computing expiration time:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getProducts,
    computeTotal,
    computeIVA,
    computeExpiration
};
