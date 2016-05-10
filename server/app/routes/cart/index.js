'use strict';
var router = require('express').Router();
var Cart = require('mongoose').model('Cart');
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.post('/', ensureAuthenticated, function (req, res) {
  Cart.getCart(req.user)
    .then(function(cart){
      res.send(cart);
    });
});

router.put('/', ensureAuthenticated, function (req, res) {
  Cart.getCart(req.user)
    .then(function(cart){
      cart.counter = req.body.counter;
      return cart.save();
    })
    .then(function(cart){
      res.send(cart);
    });
});
