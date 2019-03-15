'use strict';

export default function fbViewCtrl($uibModalInstance) {
    var vm = this;

    vm.close = function() {
        $uibModalInstance.close(null);
    };
};
