'use strict';

import angular from 'angular';

  angular
    .module('lavasoft')
    .controller('ViewCtrl', function($uibModalInstance) {
        var vm = this;

        vm.close = function() {
            $uibModalInstance.close(null);
        };
    });
