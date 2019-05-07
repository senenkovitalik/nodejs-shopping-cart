var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var { check } = require('express-validator/check');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Invalid password').isLength({ min: 5 })
  ],
  passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  }));

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/signin', function (req, res, next) {
  if (req.user) {
    return res.redirect('/');
  }
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Invalid password').isLength({ min: 5 })
  ],
  passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
  }));

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('user/profile');
});

function isLoggedIn(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect('/user/signin');
}

module.exports = router;
