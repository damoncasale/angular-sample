'use strict';

import angular from 'angular';

  angular
    .module('lavasoft')
    .directive('fbAdmin', function() {
      return {
        restrict: 'E',
        templateUrl: 'components/admin/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'vm',
        bindToController: true
      };
    });

  angular
    .module('lavasoft')
    .controller('AdminCtrl', function($scope, $element, $state,
        $stateParams, $q, $uibModal, feedbackService) {
        var vm = this;
        vm.feedbackService = feedbackService;
        vm.uploads = [];
        vm.feedbackForm = {};
        vm.modalInstance = null;

        vm.view = function(id) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'view.html',
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
    });
