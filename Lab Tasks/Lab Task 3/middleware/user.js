const Users = require('../models/user');
const express = require('express');
const router = express.Router();

async function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const user = await Users.findById(req.session.userId);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      console.error(err);
    }
  }
  res.redirect('/users/login');
}

async function isAdmin(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const user = await Users.findById(req.session.userId);
      if (user && user.role === 'admin') {
        req.user = user;
        return next();
      }
    } catch (err) {
      console.error(err);
    }
  }
  res.status(403).send('Access denied: Admins only');
}

router.use(async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await Users.findById(req.session.userId);
      res.locals.user = user;
    } catch (err) {
      console.error(err);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

module.exports = { isAuthenticated, isAdmin, router };
