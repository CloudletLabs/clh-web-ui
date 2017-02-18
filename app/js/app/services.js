define(['angular', 'angularEnvironment'], function (angular) {
    'use strict';

    /* Services */

    var clhServices = angular.module('clhServices', []);
    clhServices.service('Resolver', ['$q', Resolver]);
    clhServices.service('ResourceService', ['envService', '$q', '$http', '$window', ResourceService]);
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
    function ResourceService(envService, $q, $http, $window) {

        var apiUrl = envService.read('apiUrl') + '/' + envService.read('apiVersion');

        var _promises = {};
        
        // Save to cache
        var _genericCallback = function (key, data) {
            _promises[key] = data;
        };

        // Return data from cache
        // Or if not found or specifically requested - get it from server
        var _promisesGetter = function (request, key, refresh) {
            if (!refresh && _promises[key] !== undefined) {
                return $q.when(_promises[key]);
            } else {

                return _ajaxRequest(request, key);
            }
        };

        // Get data from server     
        var _ajaxRequest = function (request, key) {
            var deferred = $q.defer();
            // Request
            $http(
                    {
                        method  : request.method, 
                        url     : apiUrl + request.url,
                        headers : request.headers, 
                        data    : request.data
                    }
                ).success(function (data) {
                // Success
                deferred.resolve(data);
                // Save GET requests in cache
                if (request.method === 'GET') _genericCallback(key, data);
            }).error(function (data, status) {
                // Ooops
                deferred.reject({status: status, data: data});
            });
            return deferred.promise;
        };

        // Route angular services to API calls
        return {
            login: function (username, password) {
               
                var basic = 'Basic ' + $window.btoa(username + ':' + password);

                var header = { "Authorization" : basic };
                
                var request = 
                {        
                    method  : 'POST',
                    url     : '/auth_token',
                    headers : header,
                    data    : null
                };

                return _ajaxRequest(request, null);
            },
           
            register: function (user) {
                var request = 
                {        
                    method : 'POST',
                    url : '/users',
                    headers : null,
                    data : user
                };

                return _ajaxRequest(request, null);
            },
           
           getCurrentUser: function () {
                var request = 
                {        
                    method : 'GET',
                    url : '/user',
                    headers : null,
                    data : null
                };

                return _promisesGetter(request, "currentUser", true);
            },
            getUsers: function (refresh) {
                 var request = 
                {        
                    method : 'GET',
                    url : '/users',
                    headers : null,
                    data : null
                };

                return _promisesGetter(request, "users", refresh);
            },
            
            getUserDetails: function (username, refresh) {
                 var request = 
                {        
                    method : 'GET',
                    url : '/users/' + username,
                    headers : null,
                    data : null
                };

                return _promisesGetter(request, "user_" + username, refresh);
            },
            
            createUser: function (user) {
                 var request = 
                {        
                    method : 'POST',
                    url : '/users',
                    headers : null,
                    data : user
                };

                return _ajaxRequest(request, null);
            },
            
            updateUser: function (username, user) {
                 var request = 
                {        
                    method : 'PUT',
                    url : '/users/' + username,
                    headers : null,
                    data : user
                };

                return _ajaxRequest(request, null);
            },
           
            deleteUser: function (username) {
                 var request = 
                {        
                    method : 'DELETE',
                    url : '/users/' + username,
                    headers : null,
                    data : null
                };

                return _ajaxRequest(request, null);
            },
           
            getNews: function (refresh) {
                 var request = 
                {        
                    method : 'GET',
                    url : '/news',
                    headers : null,
                    data : null
                };

                return _promisesGetter(request, "news", refresh);
            },
            
            getNewsBySlug: function (slug, refresh) {
                 var request = 
                {        
                    method : 'GET',
                    url : '/news/' + slug,
                    headers : null,
                    data : null
                };

                return _promisesGetter(request, "news_" + slug, refresh);
            },
            
            createNews: function (news) {
                  var request = 
                {        
                    method : 'POST',
                    url : '/news',
                    headers : null,
                    data : news
                };

                return _ajaxRequest(request, null);
            },
            
            updateNews: function (slug, news) {
                 var request = 
                {        
                    method : 'PUT',
                    url : '/news/' + slug,
                    headers : null,
                    data : news
                };

                return _ajaxRequest(request, null);
            },
            
            deleteNews: function (slug) {
                 var request = 
                {        
                    method : 'DELETE',
                    url : '/news/' + slug,
                    headers : null,
                    data : null
                };

                return _ajaxRequest(request, null);
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

                // Get a token
                ResourceService.login(username, enc_password.toString()).then(function (data) {
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