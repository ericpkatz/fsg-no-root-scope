app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        resolve: {
          cart: function(CartFactory){
            return CartFactory.getCart();
          }
        },
        url: '/members-area',
        template: '<img ng-repeat="item in stash" ng-click="updateCart()" width="300" ng-src="{{ item }}" />',
        controller: function ($scope, CartFactory, SecretStash, cart) {
            SecretStash.getStash().then(function (stash) {
                $scope.stash = stash;
                $scope.cart = cart;
            });
            $scope.updateCart = function(){
              $scope.cart.counter++;
              CartFactory.updateCart()
                .then(function(){
                
                });
            };
            
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.factory('SecretStash', function ($http) {

    var getStash = function () {
        return $http.get('/api/members/secret-stash').then(function (response) {
            return response.data;
        });
    };

    return {
        getStash: getStash
    };

});
