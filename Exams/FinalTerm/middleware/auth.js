const Users = require('../models/user');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }
    next();
};

// Middleware to check if user is not admin
const isNotAdmin = async (req, res, next) => {
    try {
        const user = await Users.findById(req.session.userId);
        if (user && user.role === 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access Denied. Admin users cannot access user features.' 
            });
        }
        next();
    } catch (error) {
        console.error('Error checking user role:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
};

module.exports = {
    isAuthenticated,
    isNotAdmin
}; 