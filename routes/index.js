var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');
var { isLoggedIn } = require('../utils/utils');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
    if (err) {
      console.log(err);
    }
    var productsChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productsChunks.push(docs.slice(i, i + chunkSize));
    }
    var locals = {
      title: 'Shopping Cart',
      products: productsChunks,
      successMsg: successMsg,
      noMessages: !successMsg
    };
    res.render('shop/index', locals);
  });
});

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart
    ? req.session.cart
    : {});

  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart
    ? req.session.cart
    : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart
    ? req.session.cart
    : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.route('/checkout')
  .all(isLoggedIn)
  .get(function (req, res, next) {
    if (!req.session.cart) {
      return res.redirect('shop/shopping-cart');
    }

    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    var locals = {
      total: cart.totalPrice,
      errMsg: errMsg,
      noError: !errMsg,
      csrfToken: req.csrfToken()
    };
    res.render('shop/checkout', locals);
  })
  .post(function (req, res, next) {
    if (!req.session.cart) {
      return res.redirect('shop/shopping-cart');
    }

    var cart = new Cart(req.session.cart);

    const stripe = require("stripe")("sk_test_bWD23H5GEPv6AgrZRwRv3q5H00fnYqiFUM");
    stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: "usd",
      source: req.body.stripeToken,
      description: "Test Charge"
    }, function (err, charge) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }
      var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
      });
      order.save(function(err, result) {
        req.flash('success', 'Successfully bought products!');
        req.session.cart = null;
        res.redirect('/');
      });
    });
  });

module.exports = router;
