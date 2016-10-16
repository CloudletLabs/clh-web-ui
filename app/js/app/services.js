define(['angular', 'angularEnvironment'], function (angular) {
    'use strict';

    /* Services */

    var clhServices = angular.module('clhServices', []);
    clhServices.service('Resolver', ['$q', Resolver]);
    clhServices.service('ResourceService', ['envService', '$q', '$http', ResourceService]);
    clhServices.service('TokenInterceptor', ['$q', '$location', 'localStorageService', TokenInterceptor]);
    clhServices.service('CryptoJSService', [CryptoJSService]);
    clhServices.service('AuthenticationService', ['localStorageService', AuthenticationService]);

    /**
     * Resolver service
     * Run all needed queries async and return them all once ready
     */
    function Resolver($q) {
        return function (promises) {
            return $q.all(promises);
        }
    }

    /**
     * Resource server - query data from server and cache it
     */
    function ResourceService(envService, $q, $http) {

        var apiUrl = envService.read('apiUrl') + '/' + envService.read('apiVersion');

        var _promises = {};

        // Save to cache
        var _genericCallback = function (key, data) {
            _promises[key] = data;
        };

        // Return data from cache
        // Or if not found or specifically requested - get it from server
        var _promisesGetter = function (method, URL, data, key, refresh) {
            if (!refresh && _promises[key] !== undefined) {
                return $q.when(_promises[key]);
            } else {
                return _ajaxRequest(method, URL, data, key);
            }
        };

        // Get data from server
        var _ajaxRequest = function (method, URL, data, key) {
            var deferred = $q.defer();
            // Request
            $http({method: method, url: apiUrl + URL, data: data}).success(function (data) {
                // Success
                deferred.resolve(data);
                // Save GET requests in cache
                if (method === 'GET') _genericCallback(key, data);
            }).error(function (data, status) {
                // Ooops
                deferred.reject({data: data, status: status});
            });
            return deferred.promise;
        };

        // Route angular services to API calls
        return {
            login: function (user) {
                return _ajaxRequest('POST', '/auth_token', user, null);
            },
            register: function (user) {
                return _ajaxRequest('POST', '/users', user, null);
            },
            getCurrentUser: function () {
                return _promisesGetter('GET', '/user', null, "currentUser", true);
            },
            getUsers: function (refresh) {
                return _promisesGetter('GET', '/users', null, "users", refresh);
            },
            getUserDetails: function (username, refresh) {
                return _promisesGetter('GET',
                    '/users/' + username,
                    null,
                    "user_" + username,
                    refresh);
            },
            updateUser: function (user) {
                return _ajaxRequest('PUT', '/users/' + user.username, user, null);
            },
            deleteUser: function (username) {
                return _ajaxRequest('DELETE', '/users/' + username, null, null);
            },
            createUser: function (user) {
                return _ajaxRequest('POST', '/users', user, null);
            },
            getNews: function (refresh) {
                return _promisesGetter('GET', '/news', null, "news", refresh);
            },
            getNewsBySlug: function (slug, refresh) {
                return _promisesGetter('GET',
                    '/news/' + slug,
                    null,
                    "news_" + slug,
                    refresh);
            },
            updateNews: function (slug, news) {
                return _ajaxRequest('PUT', '/news/' + slug, news, null);
            },
            createNews: function (news) {
                return _ajaxRequest('POST', '/news', news, null);
            },
            deleteNews: function (slug) {
                return _ajaxRequest('DELETE', '/news/' + slug, null, null);
            }
        }
    }

    /**
     * Interceptor for auth token
     */
    function TokenInterceptor($q, $location, localStorageService) {
        return {
            request: function (config) {
                config.headers = config.headers || {};

                if (localStorageService.get("auth_token")) {
                    config.headers.Authorization = 'Bearer ' + localStorageService.get("auth_token");
                }

                return config;
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response.config.url !== "/auth_token" && response.status === 401) {
                    localStorageService.clearAll();
                    $location.path("/login");
                }
                return $q.reject(response);
            }
        };
    }

    /**
     * Wrapper service for CryptoJS
     */
    function CryptoJSService() {
        return CryptoJS;
    }

    /**
     * Auth service - tell us is there a user and what kind of user is it
     */
    function AuthenticationService(localStorageService) {
        return {
            isLogged: function () {
                var authenticated = false;
                if (localStorageService.get("auth_token") !== null) {
                    authenticated = true;
                }
                return authenticated;
            },
            isAdmin: function () {
                var admin = false;
                if (localStorageService.get("user") !== null &&
                    localStorageService.get("user").roles.some(function (role) {
                        return role.roleId == 'ADMIN';
                    })) {
                    admin = true;
                }
                return admin;
            }
        }
    }

    return clhServices;
});