const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Order = require('../models/order');
const Users = require('../models/user');
const { isAuthenticated, isNotAdmin } = require('../middleware/auth');
const { initCart } = require('../middleware/cart');

const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};


router.get('/', isAuthenticated, isNotAdmin, (req, res) => {
    initCart(req);
    res.render('cart', { cart: req.session.cart });
});


router.get('/items', isAuthenticated, isNotAdmin, (req, res) => {
    const cart = req.session.cart || { items: [] };
    res.json(cart);
});

 
router.post('/add', isAuthenticated, isNotAdmin, async (req, res) => {
    try {
        const { productId, name, price, quantity } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (!req.session.cart) {
            req.session.cart = { items: [] };
        }

        const existingItem = req.session.cart.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            req.session.cart.items.push({
                productId,
                name,
                price,
                quantity: parseInt(quantity),
                imageUrl: product.imageUrl
            });
        }

        res.redirect('/products');
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
});

// Update cart item quantity
router.put('/update/:productId', isAuthenticated, isNotAdmin, (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!req.session.cart) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const item = req.session.cart.items.find(item => item.productId === productId);
    if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.quantity = parseInt(quantity);
    res.json({ success: true, cart: req.session.cart });
});

// Remove item from cart 
router.delete('/remove/:productId', isAuthenticated, isNotAdmin, (req, res) => {
    const { productId } = req.params;

    if (!req.session.cart) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    req.session.cart.items = req.session.cart.items.filter(item => item.productId !== productId);
    res.json({ success: true, cart: req.session.cart });
});

// Get checkout page 
router.get('/checkout', isAuthenticated, isNotAdmin, (req, res) => {
    initCart(req);
    
    // Ensure cart exists and has items
    if (!req.session.cart || !req.session.cart.items || req.session.cart.items.length === 0) {
        return res.redirect('/cart');
    }

    // Calculate total
    const total = req.session.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    req.session.cart.total = total;

    res.render('checkout', { 
        layout: 'layouts/layout',
        cart: req.session.cart,
        error: null
    });
});

// Place order 
router.post('/place-order', isAuthenticated, isNotAdmin, async (req, res) => {
    try {
        if (!req.session.cart || req.session.cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        const { fullName, phone, address, city, state, zipCode } = req.body;

        
        const user = await Users.findById(req.session.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        // Create new order
        const order = new Order({
            user: req.session.userId,
            items: req.session.cart.items.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.imageUrl
            })),
            shippingDetails: {
                fullName,
                email: user.email, 
                phone,
                address,
                city,
                state,
                zipCode
            },
            totalAmount: req.session.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
        });

        await order.save();

        // Clear cart after successful order
        req.session.cart = { items: [] };

        res.json({ success: true, message: 'Order placed successfully', orderId: order._id });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: 'Error placing order' });
    }
});

// Get user orders page
router.get('/my-orders', isAuthenticated, isNotAdmin, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.session.userId })
            .sort({ createdAt: -1 });

        res.render('my-orders', {
            orders,
            layout: 'layouts/layout',
            error: null
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).render('my-orders', {
            orders: [],
            layout: 'layouts/layout',
            error: 'Error fetching orders'
        });
    }
});

module.exports = router; 