const express = require("express");
const server = express();
const session = require('express-session');
const { router: userMiddleware } = require('./middleware/user');

server.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

const mongoose = require("mongoose");
const routeradmin = require("./routes/admin/admin");
const userindex = require("./routes/user");
const productsRouter = require("./routes/products");
const contactRouter = require("./routes/contact");
const Users = require('./models/user');
const Product = require('./models/product');

const expressLayouts = require("express-ejs-layouts");
server.use(express.static("public"));
server.set("layout", "layouts/layout");
server.set("view engine", "ejs");
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(expressLayouts);

// Apply user middleware
server.use(userMiddleware);

// Routes
server.use('/', productsRouter);
server.use('/users/', userindex);
server.use('/admin', routeradmin);
server.use('/cart', require('./routes/cart'));
server.use('/contact', contactRouter);

mongoose.connect("mongodb://localhost:27017/gymshark").then(() => {
  console.log("✅ Connected to MongoDB");
});


server.listen(3000, () => {
  console.log(`✅ Server Started at http://localhost: 3000`);
});