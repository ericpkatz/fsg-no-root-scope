(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.
    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function () {
        if (!window.io) throw new Error('socket.io not found!');
        return window.io(window.location.origin);
    });

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function (response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response)
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    });

    app.factory('AuthService', function ($http, $q, $rootScope) {
      var _authPromise = null;
      var _auth = {};
      return {
        auth: _auth,
        getUser: function(){
          if(_authPromise)
            return _authPromise;
          _authPromise = $http.get('/session')
            .then(function(response){
              angular.copy(response.data, _auth);
              return _auth;
            });
          return _authPromise;
        },
        login: function(credentials){
            return $http.post('/login', credentials)
                .then(function(response){
                  angular.copy(response.data, _auth);
                  $rootScope.$broadcast('LOGGEDIN');
                  return _auth;
                })
                .catch(function () {
                    return $q.reject({ message: 'Invalid login credentials.' });
                });
        },
        logout: function(){
          var that = this;
            return $http.get('/logout').then(function () {
              $rootScope.$broadcast('LOGGEDOUT');
              that.resetUser();
            });
        },
        resetUser: function(){
          angular.copy({}, _auth);
          _authPromise = null;
        }
      };
    });
})();
