const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const Users = require('../../models/user');
const Order = require('../../models/order');
const Complaint = require('../../models/complaint');
const { isAdmin } = require('../../middleware/admin');
router.use(isAdmin);

// Admin dashboard
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('admin/dashboard', { 
            products,
            layout: 'layouts/admin',
            path: '/admin'
        });
    } catch (err) {
        console.error(err);
        res.render('admin/dashboard', { 
            products: [],
            layout: 'layouts/admin',
            path: '/admin'
        });
    }
});

// Add product form
router.get('/products/add', (req, res) => {
    res.render('admin/add-product', { 
        layout: 'layouts/admin',
        path: '/admin/products/add'
    });
});

// Add product
router.post('/products/add', async (req, res) => {
    try {
        const { name, price, description, category, imageUrl } = req.body;
        
        if (!name || !price || !description || !category || !imageUrl) {
            return res.status(400).send('All fields are required');
        }
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

        const product = new Product({
            name,
            price: parseFloat(price),
            description,
            category: formattedCategory,
            imageUrl
        });

        const savedProduct = await product.save();
        console.log('Product saved successfully:', savedProduct);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).render('admin/add-product', { 
            layout: 'layouts/admin',
            path: '/admin/products/add',
            error: 'Error adding product. Please try again.',
            formData: req.body
        });
    }
});

// Edit product form
router.get('/products/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('admin/edit-product', { 
            product,
            layout: 'layouts/admin',
            path: '/admin/products/edit'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading product');
    }
});

// Update product
router.post('/products/edit/:id', async (req, res) => {
    try {
        const { name, price, description, category, imageUrl } = req.body;
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                price: parseFloat(price),
                description,
                category: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
                imageUrl
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product');
    }
});

// Delete product
router.delete('/products/delete/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
});

// Get all products for index page
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

// Admin orders page
router.get('/orders', isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.render('admin/orders', {
            orders,
            layout: 'layouts/admin',
            path: '/admin/orders'
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).render('admin/orders', {
            orders: [],
            layout: 'layouts/admin',
            path: '/admin/orders',
            error: 'Error fetching orders'
        });
    }
});

// Update order status
router.put('/orders/:orderId/status', isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, order });
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ success: false, message: 'Error updating order status' });
    }
});

// Get all complaints
router.get('/complaints', async (req, res) => {
    try {
        console.log('Fetching complaints...');
        
        // First check if the Complaint model is properly imported
        if (!Complaint) {
            console.error('Complaint model is not properly imported');
            throw new Error('Complaint model not found');
        }

        const complaints = await Complaint.find()
            .sort({ timestamp: -1 })
            .populate('userId', 'email');

        console.log('Complaints fetched successfully:', complaints);

        res.render('admin/complaints', {
            complaints,
            layout: 'layouts/admin',
            path: '/admin/complaints'
        });
    } catch (error) {
        console.error('Detailed error in fetching complaints:', {
            message: error.message,
            stack: error.stack
        });
        
        res.render('admin/complaints', {
            complaints: [],
            layout: 'layouts/admin',
            path: '/admin/complaints',
            error: 'Error fetching complaints: ' + error.message
        });
    }
});

module.exports = router;