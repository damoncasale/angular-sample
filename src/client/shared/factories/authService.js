'use strict';

export default function authService($q, localStorageService, baseService) {
    var authServiceFactory = {
        queryTerm: 'auth',
        token: null,
        currentUser: {},
        username: null,
        password: null,
        isAuthenticated: function() {
            return (null !== authServiceFactory.token);
        },
        fillAuthDataFromCache: function() {
            var token, isAdmin;
            if (!authServiceFactory.token) {
                token = localStorageService.get("token");
                if (token) {
                    authServiceFactory.token = token;
                }
                isAdmin = localStorageService.get("isAdmin");
                if (isAdmin) {
                    authServiceFactory.isAdmin = isAdmin;
                } else {
                    authServiceFactory.isAdmin = false;
                }
            }
            if (authServiceFactory.token) {
                return $q.when(true);
            } else {
                return $q.when(false);
            }
        },
        login: function() {
            return baseService.save(
                authServiceFactory.queryTerm,
                {
                    username: authServiceFactory.username,
                    password: authServiceFactory.password
                },
                null,
                true
            )
            .then(function(data) {
                authServiceFactory.token = data.token;
                authServiceFactory.currentUser = data.user;
                localStorageService.set("token", data.token);
                return null;
            });
        },
        logout: function() {
            authServiceFactory.currentUser = {};
            authServiceFactory.token = null;
            localStorageService.set("token", null);
        }
    };

    return authServiceFactory;
};
