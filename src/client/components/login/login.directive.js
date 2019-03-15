'use strict';

const loginHtml = require('./login.html');

export function fbLoginDirective() {
  return {
    restrict: 'E',
    templateUrl: loginHtml,
    controller: 'LoginCtrl',
    controllerAs: 'vm',
    bindToController: true
  };
};

export function fbLoginCtrl($state, $location, authService) {
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
};
