'use strict';

const feedbackHtml = require('./feedback.html');

export function fbFeedbackDirective() {
  return {
    restrict: 'E',
    templateUrl: feedbackHtml,
    controller: 'FeedbackCtrl',
    controllerAs: 'vm',
    bindToController: true
  };
};

export function fbFeedbackCtrl($scope, $element, $state,
    $stateParams, $q, FileUploader, feedbackService) {
    var vm = this;
    vm.feedbackService = feedbackService;
    vm.uploads = [];
    vm.feedbackForm = {};

    vm.uploader = new FileUploader({
        url: feedbackService.getUploadPath(),
        autoUpload: true,
        queueLimit: 3,
        filters: [{
            name: 'GIF, JPG, JPEG, or PNG files',
            fn: function(item) {
                var pos = item.name.lastIndexOf(".");
                return (-1 !== [".gif", ".jpg", ".jpeg", ".png"].indexOf(item.name.substr(pos).toLowerCase()));
            }
        }],
        onSuccessItem: function(item, response /*, status, headers*/) {
            vm.uploads.push(response);
        },
        onCompleteAll: function() {
            // Do nothing
        }
    });

    vm.add = function() {
        if (vm.feedbackForm.$valid) {
            // Populate uploaded image IDs in the submitted feedback form
            vm.feedbackService.newFeedback.uploads = _.map(vm.uploads, function(upload) {
                return upload.id;
            });
            vm.feedbackService.add()
            .then(function() {
                vm.message = "";
                alert("Your feedback has been submitted.");
                vm.feedbackService.reset(vm.feedbackForm);
            })
            .catch(function(error) {
                vm.message = error.data.message;
            });
        }
    };

    vm.removeUpload = function(item) {
        var upload = _.find(vm.uploads, function(up) {
            return (0 === up.originalFilename.localeCompare(item.file.name));
        });
        if (upload) {
            vm.feedbackService.deleteUpload(upload.id);
            item.remove();
        } else {
            item.remove();
        }
    };
};
