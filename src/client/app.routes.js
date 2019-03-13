(function() {
  'use strict';

  angular
    .module('lavasoft')
    .config(routes);

  routes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routes($stateProvider, $urlRouterProvider) {

    var accountTokenResolve = function($q, $state, $stateParams, authService) {
        return authService.fillAuthDataFromCache().then(function() {
            if (authService.token) {
                return authService.token;
            } else {
                return $q.reject(false);
            }
        });
    };

    $stateProvider.state('login', {
      url: '/login',
      template: '<fb-login></fb-login>'
    });

    $stateProvider.state('admin', {
      url: '/admin',
      template: '<fb-admin></fb-admin>',
      data: {
        requireAuth: true
      },
      resolve: {
          __token: accountTokenResolve
      }
    });

    $stateProvider.state('add', {
      url: '/add',
      views: {
        content: {
          template: '<fb-feedback></fb-feedback>'
        }
      }
    });

    $urlRouterProvider.otherwise('/login');
  }
})();
