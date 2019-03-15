'use strict';

import angular from 'angular';

export default function baseService($http, $q, ENV) {

    var baseServiceFactory = {
        encode: function(uri) {
            return uri ? uri.replace("%2F", "*") : "";
        },
        getPath: function(uri, params) {
            var url = ENV.API_URL + baseServiceFactory.encode(uri);
            if (params) {
                url += "?" + $.param(params);
            }
            return url;
        },
        get: function(uri, params) {
            var promise, tmpParams;
            if (params) {
                tmpParams = angular.copy(params);
                if (("undefined" !== typeof params.token) && params.token) {
                    params.token = baseServiceFactory.encode(params.token);
                }
                promise = $http.get(ENV.API_URL + baseServiceFactory.encode(uri), {
                    params: tmpParams
                });
            } else {
                promise = $http.get(ENV.API_URL + baseServiceFactory.encode(uri));
            }
            return promise
            .then(function(response) {
                if (200 === response.status) {
                    return response.data;
                } else {
                    return $q.reject(response);
                }
            });
        },
        delete: function(uri, params) {
            var promise, tmpParams;
            if (params) {
                tmpParams = angular.copy(params);
                if (("undefined" !== typeof params.token) && params.token) {
                    params.token = baseServiceFactory.encode(params.token);
                }
                promise = $http.delete(ENV.API_URL + baseServiceFactory.encode(uri), {
                    params: tmpParams
                });
            } else {
                promise = $http.delete(ENV.API_URL + baseServiceFactory.encode(uri));
            }
            return promise
            .catch(function(error) {
                if (404 === error.status) {
                    return error;
                } else {
                    return $q.reject(error);
                }
            });
        },
        save: function(uri, data, id, useJson) {
            var method = id ? "put" : "post";
            var tmpData = angular.copy(data);
            useJson = useJson || false;
            if ("undefined" !== typeof data.token) {
                data.token = baseServiceFactory.encode(data.token);
            }
            return $http[method](ENV.API_URL + baseServiceFactory.encode(uri), useJson ? tmpData : $.param(tmpData), {
                headers: {
                    'Content-Type': useJson ?
                        'application/json' :
                        'application/x-www-form-urlencoded;charset=utf-8;'
                }
            })
            .then(function(response) {
                if (200 === response.status) {
                    return response.data;
                } else {
                    return $q.reject(response);
                }
            });
        },
        saveAll: function(uri, data) {
            var tmpData = angular.copy(data);
            if ("undefined" !== typeof data.token) {
                data.token = baseServiceFactory.encode(data.token);
            }
            return $http.post(ENV.API_URL + baseServiceFactory.encode(uri), $.param(tmpData), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(function(response) {
                if (200 === response.status) {
                    return response.data;
                } else {
                    return $q.reject(response);
                }
            });
        },
        reset: function(obj) {
            angular.forEach(Object.keys(obj), function(key) {
                delete obj[key];
            });
        }
    };

    return baseServiceFactory;
};
