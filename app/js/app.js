define([
    'angular',
    'angularRoute',
    'angularAnimate',
    'angularLocalStorage',
    'angularToastr',
    'angularEnvironment',
    'jquery',
    'jqueryUI',
    'bootstrap',
    'markdown',
    'cryptojslib',
    'indexControllers',
    'loginControllers',
    'usersControllers',
    'newsControllers',
    'services',
    'directives',
    'gunttMainModule',
    'filters',
    'version'
], function (angular) {
    'use strict';

    /**
     * Define our app module
     */
    var clhApp = angular.module('clhApp', [
        'ngRoute',
        'ngAnimate',
        'LocalStorageModule',
        'toastr',
        'environment',
        'clhIndexControllers',
        'clhLoginControllers',
        'clhUsersControllers',
        'clhNewsControllers',
        'clhServices',
        'clhDirectives',
        'gunttMainModule',
        'clhFilters',
        'clhVersion'
    ]);

    /**
     * Configure the app
     * TODO: Add ERB marks for other envs
     */
    clhApp.config(['envServiceProvider', function(envServiceProvider) {
        envServiceProvider.config({
            domains: {
                local: ['localhost', '127.0.0.1'],
                dev: ['clh-web-ui-dev.herokuapp.com']
            },
            vars: {
                local: {
                    apiVersion: 'current',
                    apiUrl:  'http://192.168.99.100:8087/api',
                    //apiUrl:  'http://localhost:8087/api',
                    enableDebug: true
                },
                dev: {
                    apiVersion: 'current',
                    apiUrl:  'https://clh-web-api-dev.herokuapp.com/api',
                    enableDebug: false
                }
            }
        });
        // Check method will detect current env based on hostname
        envServiceProvider.check();
        // Alternatively you can specifically set env you need
        // envServiceProvider.set('dev');
    }]);

    /**
     * Set logging level
     */
    clhApp.config(['$logProvider', 'envServiceProvider', function ($logProvider, envServiceProvider) {
        $logProvider.debugEnabled(envServiceProvider.read('enableDebug'));
    }]);
    clhApp.config(['$compileProvider', 'envServiceProvider', function ($compileProvider, envServiceProvider) {
        $compileProvider.debugInfoEnabled(envServiceProvider.read('enableDebug'));
    }]);

    /**
     * Configure http interceptor to inject auth token
     */
    clhApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }]);

    /**
     * Configure toastr
     */
    clhApp.config(function (toastrConfig) {
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
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            progressBar: false,
            tapToDismiss: true,
            target: 'body',
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 3000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    });

    /**
     * Configure routing
     */
    clhApp.config(['$routeProvider',
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
                access: {
                    requiredLogin: false,
                    requiredAdmin: false
                }
            }).when('/', {
                redirectTo: '/index'
            }).when('/index', {
                templateUrl: 'partials/index.html',
                controller: 'IndexCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function (Resolver, ResourceService) {
                        return Resolver([ResourceService.getNews(true)]);
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
                        return Resolver([ResourceService.getNewsBySlug($route.current.params.slug, true)]);
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
                        return Resolver([ResourceService.getUsers(true)]);
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
                        return Resolver([ResourceService.getUserDetails($route.current.params.username, true)]);
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
            }).when('/guntt', {
                templateUrl: 'partials/guntt_templates/01_guntt_main.html',
                //controllerAs: 'vm',
                access: {
                    requiredLogin: true,
                    requiredAdmin: false
                }
            }).otherwise({
                redirectTo: '/404'
            });
        }]);

    /**
     * Intercept routing change to check if user have an access
     */
    clhApp.run(['$rootScope', '$location', 'AuthenticationService', 'toastr',
        function ($rootScope, $location, AuthenticationService, toastr) {
            $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
                if (nextRoute.redirectTo) {
                    // do nothing
                } else if (nextRoute.access === undefined) {
                    // Fail fast - no access rules defined for this route
                    $location.path("/404");
                } else if (nextRoute.access.requiredAdmin && !AuthenticationService.isAdmin()) {
                    // Pretend there is no such page if user is not an admin
                    $location.path("/404");
                } else if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged()) {
                    // This route require access, and user is not logged in - redirect to login form
                    // TODO: preserve original path and redirect to it once authorised
                    $location.path("/login");
                }
            });
            $rootScope.$on('$routeChangeError', function(event, currentRoute, previousRoute, rejection) {
                $location.path("/404");
                if (rejection && rejection.data && rejection.data.message) {
                    toastr.error(rejection.data.message);
                } else {
                    toastr.error('Unknown error');
                }
            });
        }]
    );

    return clhApp;
});