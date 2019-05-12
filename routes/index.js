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
        res.render('shop/index', {title: 'Shopping Cart', products: productsChunks});
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

router.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('shop/shopping-cart');
    }

    var cart = new Cart(req.session.cart);
    res.render('shop/checkout', {total: cart.totalPrice});
});

router.post('/checkout', function(req, res, next) {
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
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        req.flash('success', 'Successfully bought prodacts!');
        req.cart = null;
        res.redirect('/');
    });
});

module.exports = router;
