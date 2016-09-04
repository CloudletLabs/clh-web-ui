define([
    'angular',
    'angularRoute',
    'angularAnimate',
    'angularLocalStorage',
    'angularToastr',
    'jquery',
    'bootstrap',
    'markdown',
    'cryptojslib',
    'controllers',
    'services',
    'directives',
    'filters',
    'version'
], function (angular) {
    'use strict';

    // Import variables if present (from env.js)
    var __env = {};
    if(window){
        Object.assign(__env, window.__env);
    }

    /**
     * Define our app module
     */
    var bdnApp = angular.module('bdnApp', [
        'ngRoute',
        'ngAnimate',
        'LocalStorageModule',
        'toastr',
        'bdnControllers',
        'bdnServices',
        'bdnDirectives',
        'bdnFilters',
        'bdnVersion'
    ]);

    /**
     * Register environment in AngularJS as constant
     */
    bdnApp.constant('__env', __env);

    /**
     * Set logging level
     */
    bdnApp.config(['$logProvider', function ($logProvider) {
        $logProvider.debugEnabled(__env.enableDebug);
    }]);

    /**
     * Configure http interceptor to inject auth token
     */
    bdnApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }]);

    /**
     * Configure toastr
     */
    bdnApp.config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            allowHtml: false,
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            containerId: 'toast-container',
            extendedTimeOut: 2000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            maxOpened: 0,
            messageClass: 'toast-message',
            newestOnTop: true,
            onHidden: null,
            onShown: null,
            positionClass: 'toast-top-full-width',
            preventDuplicates: false,
            progressBar: false,
            tapToDismiss: true,
            target: 'body',
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    });

    /**
     * Configure routing
     */
    bdnApp.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm',
                access: {
                    requiredLogin: false,
                    requiredAdmin: false
                }
            }).when('/register', {
                templateUrl: 'partials/register.html',
                controller: 'RegistrationCtrl',
                controllerAs: 'vm',
                access: {requiredLogin: false}
            }).when('/', {
                redirectTo: '/index'
            }).when('/index', {
                templateUrl: 'partials/index.html',
                controller: 'IndexCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function (Resolver, ResourceService) {
                        return Resolver([ResourceService.getNews(true)])
                    }
                },
                access: {
                    requiredLogin: false,
                    requiredAdmin: false
                }
            }).when('/news/:slug', {
                templateUrl: 'partials/news.html',
                controller: 'NewsCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function ($route, Resolver, ResourceService) {
                        return Resolver([ResourceService.getNewsBySlug($route.current.params.slug, true)])
                    }
                },
                access: {
                    requiredLogin: false,
                    requiredAdmin: false
                }
            }).when('/news', {
                templateUrl: 'partials/newsCreate.html',
                controller: 'NewsCreateCtrl',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true,
                    requiredAdmin: true
                }
            }).when('/users', {
                templateUrl: 'partials/userList.html',
                controller: 'UserListCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function (Resolver, ResourceService) {
                        return Resolver([ResourceService.getUsers(true)])
                    }
                },
                access: {
                    requiredLogin: true,
                    requiredAdmin: true
                }
            }).when('/users/:username', {
                templateUrl: 'partials/userDetail.html',
                controller: 'UserDetailsCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function ($route, Resolver, ResourceService) {
                        return Resolver([ResourceService.getUserDetails($route.current.params.username, true)])
                    }
                },
                access: {
                    requiredLogin: true,
                    requiredAdmin: true
                }
            }).when('/user', {
                templateUrl: 'partials/userCreate.html',
                controller: 'UserCreateCtrl',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true,
                    requiredAdmin: true
                }
            }).when('/404', {
                templateUrl: 'partials/404.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: false,
                    requiredAdmin: false
                }
            }).otherwise({
                redirectTo: '/404'
            });
        }]);

    /**
     * Intercept routing change to check if user have an access
     */
    bdnApp.run(['$rootScope', '$location', 'AuthenticationService', function ($rootScope, $location, AuthenticationService) {
        $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
            if (nextRoute.redirectTo) {
                // do nothing
            } else if (nextRoute.access === undefined) {
                // Fail fast - no access rules defined for this route
                $location.path("/404");
            } else if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged()) {
                // This route require access, and user is not logged in - redirect to login form
                // TODO: preserve original path and redirect to it once authorised
                $location.path("/login");
            } else if (nextRoute.access.requiredAdmin && !AuthenticationService.isAdmin()) {
                // Pretend there is no such page if user is not an admin
                $location.path("/404");
            }
        });
    }]);

    return bdnApp;
});