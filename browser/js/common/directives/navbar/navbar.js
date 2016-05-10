app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state, CartFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'About', state: 'about' },
                { label: 'Documentation', state: 'docs' },
                { label: 'Members Only', state: 'membersOnly', auth: true }
            ];

            scope.auth = AuthService.auth;

            scope.isLoggedIn = function () {
                return AuthService.auth.user;
            };

            scope.cart = CartFactory.cart;

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

        }

    };

});
