const express = require('express');
const router = express.Router();
const Complaint = require('../models/complaint');
const { isNotAdmin } = require('../middleware/auth');

router.use(isNotAdmin);

router.get('/', (req, res) => {
    console.log('User in GET route:', res.locals.user); 
    res.render('contact', {
        user: res.locals.user
    });
});


router.post('/submit', async (req, res) => {
    try {
        console.log('Received complaint submission request');
        console.log('User:', res.locals.user);
        console.log('Request body:', req.body);

        const { orderId, message } = req.body;
        
        if (!res.locals.user) {
            console.log('No user found, redirecting to login');
            return res.redirect('/users/login');
        }

       
        const complaint = new Complaint({
            userId: res.locals.user._id,
            orderId,
            message
        });

        console.log('Created complaint object:', complaint);

        
        const savedComplaint = await complaint.save();
        console.log('Successfully saved complaint:', savedComplaint);
        
        res.redirect('/contact');
    } catch (error) {
        console.error('Error saving complaint:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        res.redirect('/contact');
    }
});

module.exports = router; 