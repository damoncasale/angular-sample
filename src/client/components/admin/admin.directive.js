'use strict';

const adminHtml = require('./admin.html');
const viewHtml = require('./view.html');

export function fbAdminDirective() {
    return {
        restrict: 'E',
        templateUrl: adminHtml,
        controller: 'AdminCtrl',
        controllerAs: 'vm',
        bindToController: true
    };
};

export function fbAdminCtrl($scope, $element, $state,
    $stateParams, $q, $uibModal, feedbackService) {
    var vm = this;
    vm.feedbackService = feedbackService;
    vm.uploads = [];
    vm.feedbackForm = {};
    vm.modalInstance = null;

    vm.view = function(id) {
        vm.modalInstance = $uibModal.open({
            templateUrl: viewHtml,
            controller: 'ViewCtrl',
            controllerAs: 'vm',
            size: 'md',
            resolve: {
                item: function () {
                    return _.find(vm.feedbackService.feedbackData, function(item) {
                        return (item.id === id);
                    });
                }
            }
        });
    };

    vm.doPage = function(newPage) {
        vm.feedbackService.get(newPage)
        .then(function() {
            // eslint-disable-next-line
            //console.log(vm.feedbackService.feedbackData);
        })
        .catch(function(err) {
            // eslint-disable-next-line
            console.log(err);
            alert("Couldn't retrieve data, please retry.");
        });
    };

    // Initialize when the controller is first loaded
    vm.doPage();
};
