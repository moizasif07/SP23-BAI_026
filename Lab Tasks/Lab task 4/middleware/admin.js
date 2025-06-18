const Users = require('../models/user');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Please login first' 
        });
    }
    try {
        const user = await Users.findById(req.session.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access Denied. Admin privileges required.' 
            });
        }
        // If user is admin, proceed
        next();
    } catch (err) {
        console.error('Admin check error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error' 
        });
    }
};

module.exports = {isAdmin}; 