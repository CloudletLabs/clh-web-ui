define(['angular', 'angularEnvironment'], function (angular) {
    'use strict';

    /* Services */

    var clhServices = angular.module('clhServices', []);
    clhServices.service('Resolver', ['$q', Resolver]);
    clhServices.service('ResourceService', ['envService', '$q', '$http', ResourceService]);
    clhServices.service('TokenInterceptor', ['$q', '$location', 'localStorageService', TokenInterceptor]);
    clhServices.service('CryptoJSService', [CryptoJSService]);
    clhServices.service('AuthenticationService', ['$location', 'CryptoJSService', 'ResourceService', 'localStorageService', 'toastr', AuthenticationService]);

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
                deferred.reject({status: status, data: data});
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
            createUser: function (user) {
                return _ajaxRequest('POST', '/users', user, null);
            },
            updateUser: function (username, user) {
                return _ajaxRequest('PUT', '/users/' + username, user, null);
            },
            deleteUser: function (username) {
                return _ajaxRequest('DELETE', '/users/' + username, null, null);
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
            createNews: function (news) {
                return _ajaxRequest('POST', '/news', news, null);
            },
            updateNews: function (slug, news) {
                return _ajaxRequest('PUT', '/news/' + slug, news, null);
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
    function AuthenticationService($location, CryptoJS, ResourceService, localStorageService, toastr) {
        var self = this;
        return {
            /**
             * Read user password from plainTextPassword and save it as a hash
             * Delete plainTextPassword once done
             * Do nothing if plainTextPassword has newer been changed
             */
            encryptUserPassword: function(user) {
                if (user.plainTextPassword !== user.password) {
                    user.password = CryptoJS.PBKDF2(user.plainTextPassword, user.username, {keySize: 256 / 32}).toString();
                }
                delete user.plainTextPassword;
            },
            doLogin: function(username, password) {
                // Calculate hash function for password
                var enc_password = CryptoJS.PBKDF2(password, username, {keySize: 256 / 32});
                var user = {
                    username: username,
                    password: enc_password.toString()
                };

                // Get a token
                ResourceService.login(user).then(function (data) {
                    // Got a token - save to local storage
                    localStorageService.set("auth_token", data.auth_token);
                    // Get a user for this token
                    ResourceService.getCurrentUser().then(function (data) {
                        // Got a user - save to local storage as well
                        localStorageService.set("user", data);
                        // TODO: redirect to a resource being requested originally
                        $location.path("/index");
                    }, function (err) {
                        // Error getting a user for this token - probably expired?
                        localStorageService.clearAll();
                        $location.path("/login");
                        toastr.error(err.data.message);
                    });
                }, function (err) {
                    // Error getting a token
                    if (err.status === 401) {
                        toastr.error('Wrong username and/or password!');
                    } else {
                        toastr.error(err.data.message);
                    }
                })
            },
            doRegister: function(username, name, email, password, doLogin) {
                // Calculate hash function for password
                var enc_password = CryptoJS.PBKDF2(password, username, {keySize: 256 / 32});
                var user = {
                    username: username,
                    name: name,
                    email: email,
                    password: enc_password.toString()
                };

                // Request to create a user
                ResourceService.register(user).then(function () {
                    toastr.success('User successfully registered!');
                    doLogin(username, password);
                }, function (err) {
                    toastr.error(err.data.message);
                });
            },
            isLogged: function () {
                return localStorageService.get("auth_token") !== null;
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