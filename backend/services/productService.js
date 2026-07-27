const calculateTotal = (products) => {
    return products.reduce((acc, product) => {
        const price = parseFloat(product.price) || 0;
        return acc + price;
    }, 0);
};

const calculateIVA = (price) => {
    const numericPrice = parseFloat(price);
    return numericPrice * 0.15; // Assuming 15% IVA
};

const calculateDaysLeft = (day, month, year) => {
    const today = new Date();
    // Month is 0-indexed in Javascript Date constructor
    const expirationDate = new Date(year, month - 1, day);
    
    // Calculate difference in milliseconds
    const diffTime = expirationDate.getTime() - today.getTime();
    
    // Convert to days
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = {
    calculateTotal,
    calculateIVA,
    calculateDaysLeft
};
