(function() {
  'use strict';

  angular
    .module('lavasoft')
    .directive('fbLogin', function() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm',
        bindToController: true
      };
    });

  angular
    .module('lavasoft')
    .controller('LoginCtrl', function($state, $location, authService) {
        var vm = this,
            qs = $location.search();
        vm.authService = authService;
        vm.loginForm = {};
        vm.message = "";

        if ("undefined" !== typeof qs.email) {
            vm.authService.email = qs.email;
        }

        vm.login = function() {
            if (vm.loginForm.$valid) {
                vm.authService.login().then(function() {
                    vm.message = "";
                    $state.go("admin");
                }, function(error) {
                    vm.message = error.data.message;
                });
            }
        };
    });
})();
