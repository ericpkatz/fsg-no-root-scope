'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    counter: {
      type: Number, default: 0 
    },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

schema.statics.getCart = function(user){
  var that = this;
  return this.findOne({user: user._id})
    .then(function(cart){
      if(cart)
        return cart;
      return that.create({ user: user._id });
    });
};


mongoose.model('Cart', schema);
