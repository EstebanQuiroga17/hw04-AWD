const productService = require('../services/productService');

const computeTotal = (req, res) => {
    try {
        const { products } = req.body;
        
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: 'A products array is required' });
        }

        const total = productService.calculateTotal(products);
        res.json({ total });
    } catch (error) {
        console.error("Error computing total:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const computeIVA = (req, res) => {
    try {
        const { price } = req.body;
        
        if (price === undefined || isNaN(price)) {
            return res.status(400).json({ error: 'A valid price is required' });
        }

        const iva = productService.calculateIVA(price);
        res.json({ iva });
    } catch (error) {
        console.error("Error computing IVA:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const computeExpiration = (req, res) => {
    try {
        const { day, month, year } = req.body;

        if (!day || !month || !year) {
            return res.status(400).json({ error: 'Day, month, and year are required' });
        }

        const daysLeft = productService.calculateDaysLeft(day, month, year);
        res.json({ daysLeft });
    } catch (error) {
        console.error("Error computing expiration time:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    computeTotal,
    computeIVA,
    computeExpiration
};
