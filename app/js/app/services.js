define(['angular', 'angularEnvironment'], function (angular) {
    'use strict';

    /* Services */

    var clhServices = angular.module('clhServices', []);
    clhServices.service('Resolver', ['$q', Resolver]);
    clhServices.service('ResourceProvider', ['envService', '$q', '$http', ResourceProvider]);
    clhServices.service('ResourceService', ['ResourceProvider', ResourceService]);
    clhServices.service('TokenInterceptor', ['$q', '$location', 'localStorageService', TokenInterceptor]);
    clhServices.service('CryptoJSService', [CryptoJSService]);
    clhServices.service('AuthenticationService', ['$location', '$window', 'CryptoJSService', 'ResourceService', 'localStorageService', 'toastr', AuthenticationService]);

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
     * Resource provider - query data from server and cache it
     */
    function ResourceProvider(envService, $q, $http) {
        var _apiUrl = envService.read('apiUrl') + '/' + envService.read('apiVersion');

        var _promises = {};

        // Save to cache
        var _genericCallback = function (key, data) {
            _promises[key] = data;
        };

        // Get data from server
        var _ajaxRequest = function (request, key) {
            var deferred = $q.defer();
            // Request
            request.url = _apiUrl + request.path;
            $http(request).then(function (response) {
                // Success
                var data = response.data;
                deferred.resolve(data);
                // Save GET requests in cache
                if (key && request.method === 'GET') _genericCallback(key, data);
            }, function (response) {
                // Ooops
                deferred.reject(response);
            });
            return deferred.promise;
        };

        // Return data from cache
        // Or if not found or specifically requested - get it from server
        return function (request, key, cache) {
            if (cache && key && _promises[key] !== undefined) {
                return $q.when(_promises[key]);
            } else {
                return _ajaxRequest(request, key);
            }
        }
    }

    /**
     * Route angular services to API calls
     */
    function ResourceService(ResourceProvider) {
        return {
            login: function (auth) {
                var request = {
                    method: 'POST',
                    path: '/auth_token',
                    headers: {
                        Authorization: auth
                    }
                };
                return ResourceProvider(request);
            },
            register: function (user) {
                var request = {
                    method: 'POST',
                    path: '/users',
                    data: user
                };
                return ResourceProvider(request);
            },
            getCurrentUser: function () {
                var request = {
                    method: 'GET',
                    path: '/user'
                };
                return ResourceProvider(request, "currentUser");
            },
            getUsers: function (refresh) {
                var request = {
                    method: 'GET',
                    path: '/users'
                };
                return ResourceProvider(request, "users", !refresh);
            },
            getUserDetails: function (username, refresh) {
                var request = {
                    method: 'GET',
                    path: '/users/' + username
                };
                return ResourceProvider(request, "user_" + username, !refresh);
            },
            createUser: function (user) {
                var request = {
                    method: 'POST',
                    path: '/users',
                    data: user
                };
                return ResourceProvider(request);
            },
            updateUser: function (username, user) {
                var request = {
                    method: 'PUT',
                    path: '/users/' + username,
                    data: user
                };
                return ResourceProvider(request);
            },
            deleteUser: function (username) {
                var request = {
                    method: 'DELETE',
                    path: '/users/' + username
                };
                return ResourceProvider(request);
            },
            getNews: function (refresh) {
                var request = {
                    method: 'GET',
                    path: '/news'
                };
                return ResourceProvider(request, "news", !refresh);
            },
            getNewsBySlug: function (slug, refresh) {
                var request = {
                    method: 'GET',
                    path: '/news/' + slug
                };
                return ResourceProvider(request, "news_" + slug, !refresh);
            },
            createNews: function (news) {
                var request = {
                    method: 'POST',
                    path: '/news',
                    data: news
                };
                return ResourceProvider(request);
            },
            updateNews: function (slug, news) {
                var request = {
                    method: 'PUT',
                    path: '/news/' + slug,
                    data: news
                };
                return ResourceProvider(request);
            },
            deleteNews: function (slug) {
                var request = {
                    method: 'DELETE',
                    path: '/news/' + slug
                };
                return ResourceProvider(request);
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
                if (response.status === 401) {
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
    function AuthenticationService($location, $window, CryptoJS, ResourceService, localStorageService, toastr) {
        return {
            /**
             * Read user password from plainTextPassword and save it as a hash
             * Delete plainTextPassword once done
             * Do nothing if plainTextPassword has newer been changed
             */
            encryptUserPassword: function (user) {
                if (user.plainTextPassword !== user.password) {
                    user.password = CryptoJS.PBKDF2(user.plainTextPassword, user.username, {keySize: 256 / 32}).toString();
                }
                delete user.plainTextPassword;
            },
            doLogin: function (username, password) {
                // Calculate hash function for password
                var enc_password = CryptoJS.PBKDF2(password, username, {keySize: 256 / 32});
                var auth = 'Basic ' + $window.btoa(username + ':' + enc_password.toString());

                // Get a token
                ResourceService.login(auth).then(function (data) {
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
            doRegister: function (username, name, email, password, doLogin) {
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