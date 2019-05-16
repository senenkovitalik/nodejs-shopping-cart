var { check } = require('express-validator/check');

function isLoggedIn(req, res, next) {
  if (req.user) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
};

function redirectToOldUrl(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
}

function checkUserCredentials() {
  return [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Invalid password').isLength({ min: 5 })
  ];
}

module.exports = {
  isLoggedIn,
  redirectToOldUrl,
  checkUserCredentials
};