const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes setup
app.use('/api', productRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});
