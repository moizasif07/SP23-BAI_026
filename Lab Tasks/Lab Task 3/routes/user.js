const express = require('express');
const router = express.Router();
let Users = require("../models/user");


router.get("/register", (req, res) => {
  res.render("register"); 
});

router.get("/login", (req, res) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  res.render("login"); 
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.render("register", { error: "User already exists", name, email });
    }

    
    const newUser = new Users({ 
      name, 
      email, 
      password
    });
    await newUser.save();

    req.session.userId = newUser._id;
    req.session.userRole = newUser.role;

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.render("register", { error: "Something went wrong", name, email });
  }
});

router.get("/alluser", async (req, res) => {
  let user = await Users.find();
  res.render("homepage", {user});
});
  
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.render('login', { error: 'Incorrect email or password' });
    }

    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Incorrect email or password' });
    }

    req.session.userId = user._id;
    req.session.userRole = user.role;

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Server error. Please try again.' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/users/login');
  });
});



module.exports = router;