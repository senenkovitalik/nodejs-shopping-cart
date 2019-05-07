var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf = require('csurf');
var Cart = require('../models/cart');

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
    console.log(req.session.cart);
    res.redirect('/');
  });
});

module.exports = router;
