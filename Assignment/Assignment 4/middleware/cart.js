// Initialize cart in session if it doesn't exist
const initCart = (req) => {
    if (!req.session.cart) {
        req.session.cart = {
            items: [],
            total: 0
        };
    }
    if (!req.session.cart.items) {
        req.session.cart.items = [];
    }
    req.session.cart.total = req.session.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

module.exports = {
    initCart
}; 