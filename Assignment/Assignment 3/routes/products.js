const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Main route - only show women's category products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Women' }).sort({ createdAt: -1 });
        res.render('index', { products });
    } catch (err) {
        console.error(err);
        res.render('index', { products: [] });
    }
});

// Products route - show all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('products', { products });
    } catch (err) {
        console.error(err);
        res.render('products', { products: [] });
    }
});

module.exports = router;