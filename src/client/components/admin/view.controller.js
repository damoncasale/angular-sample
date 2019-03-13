(function() {
  'use strict';

  angular
    .module('feedback')
    .controller('ViewCtrl', function($uibModalInstance) {
        var vm = this;

        vm.close = function() {
            $uibModalInstance.close(null);
        };
    });
})();
