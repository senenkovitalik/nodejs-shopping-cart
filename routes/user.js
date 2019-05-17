var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var { check } = require('express-validator/check');
var { isLoggedIn, redirectToOldUrl, checkUserCredentials } = require('../utils/utils');
var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.route('/signup')
  .get(function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
  })
  .post(
    checkUserCredentials(),
    passport.authenticate('local.signup', {
      failureRedirect: '/user/signup',
      failureFlash: true
    }),
    redirectToOldUrl
  );

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.route('/signin')
  .get(function (req, res, next) {
    if (req.user) {
      return res.redirect('/');
    }
    var messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
  })
  .post(
    checkUserCredentials(),
    passport.authenticate('local.signin', {
      failureRedirect: '/user/signin',
      failureFlash: true
    }),
    redirectToOldUrl
  );

router.get('/profile', isLoggedIn, function (req, res, next) {
  Order.find({ user: req.user }, function (err, orders) {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach(function (order) {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', { orders: orders });
  });
});

module.exports = router;
