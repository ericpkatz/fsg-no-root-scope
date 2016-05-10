app.factory('CartFactory', function($http, AuthService, $rootScope){
  var _cart = {};
  var _cartPromise = null;

  $rootScope.$on('LOGGEDIN', function(){
    _cartPromise = null;
    getCart();
  });

  $rootScope.$on('LOGGEDOUT', function(){
    _cartPromise = null;
    angular.copy({}, _cart);
  });

  function copyCart(cart){
    angular.copy(cart, _cart);
  }

  function updateCart(){
    return $http.put('/api/cart', _cart)
      .then(function(resp){
        copyCart(response.data);
        return _cart;
      });
  };

  function getCart(){
    if(_cartPromise)
      return _cartPromise;
    _cartPromise = AuthService.getUser()
      .then(function(user){
        return $http.post('/api/cart');
      })
      .then(function(response){
        copyCart(response.data);
        return _cart;
      });
  }
  return {
    cart: _cart,
    getCart: getCart,
    updateCart: updateCart 
  };
});

app.run(function(CartFactory){
  CartFactory.getCart();
});
