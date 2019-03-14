'use strict';

angular.module('lavasoft')
    .factory('feedbackService', function($q, baseService, authService) {

        var feedbackServiceFactory = {
            isLoading: false,
            queryTerm: 'feedback',
            feedbackData: [],
            newFeedback: {},
            page: 1,
            pageSize: 10,
            count: 0,
            add: function() {
                return baseService.save(
                    queryterm,
                    newFeedback,
                    null,
                    true
                )
                .then(function(data) {
                    return null;
                });
            },
            get: function(page) {
                page = page || feedbackServiceFactory.page;
                if ((page !== feedbackServiceFactory.page) || (0 === feedbackServiceFactory.feedbackData.length)) {
                    feedbackServiceFactory.isLoading = true;
                    return baseService.save(feedbackServiceFactory.queryTerm, {
                        page: page
                    }, null, true)
                    .then(function(data) {
                        feedbackServiceFactory.page = page;
                        feedbackServiceFactory.count = data.count;
                        feedbackServiceFactory.feedbackData = data.data;
                        feedbackServiceFactory.isLoading = false;
                        return result;
                    });
                }
            },
            deleteUpload: function(id) {
                return baseService.delete("upload/" + id)
                .then(function() {
                    return null;
                })
                .catch(function() {
                    // Catch and discard any errors deleting an uploaded file
                });
            },
            getPath: function(uri, params) {
                if (!uri) {
                    uri = "";
                }
                return baseService.getPath(feedbackServiceFactory.queryTerm + uri, params);
            },
            reset: function(form) {
                return baseService.reset(form);
            }
        };

        return feedbackServiceFactory;
    });
