var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf = require('csurf');
var passport = require('passport');
var {check} = require('express-validator/check');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
  Product.find(function (err, docs) {
    if (err) {
      console.log(err);
    }
    var productsChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productsChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productsChunks });
  });
});

router.get('/user/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signup',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Invalid password').isLength({ min: 5 })
  ],
  passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  }));

router.get('/user/profile', function (req, res, next) {
  res.render('user/profile');
});

module.exports = router;
