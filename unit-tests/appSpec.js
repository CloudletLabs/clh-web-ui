define(['angular', 'angularMock', 'app'], function(angular) {

    describe('clhApp', function() {

        describe('envServiceProvider', function() {
            var envServiceProvider;
            var envService;
            beforeEach(function() {
                module('environment');
                module(function(_envServiceProvider_) {
                    envServiceProvider = _envServiceProvider_;
                    spyOn(envServiceProvider, 'config').and.callThrough();
                    spyOn(envServiceProvider, 'check').and.callThrough();
                });
                module('clhApp');
                inject(function (_envService_) {
                    envService = _envService_;
                });
            });
            it('configured', function() {
                expect(envServiceProvider.config).toHaveBeenCalledWith({
                    domains: {
                        local: ['localhost', '127.0.0.1'],
                        dev: ['clh-web-ui-dev.herokuapp.com']
                    },
                    vars: {
                        local: {
                            apiVersion: 'current',
                            apiUrl:  'http://localhost:8087/api',
                            enableDebug: true
                        },
                        dev: {
                            apiVersion: 'current',
                            apiUrl:  'https://clh-web-api-dev.herokuapp.com/api',
                            enableDebug: false
                        }
                    }
                });
                expect(envServiceProvider.check).toHaveBeenCalled();

                expect(envService.read('apiVersion')).toBe('current');
                expect(envService.read('apiUrl')).toBe('http://localhost:8087/api');
                expect(envService.read('enableDebug')).toBe(true);
            });
        });

        describe('$logProvider', function() {
            var $logProvider;
            beforeEach(function() {
                module(function(_$logProvider_) {
                    $logProvider = _$logProvider_;
                    spyOn($logProvider, 'debugEnabled').and.callThrough();
                });
                module('clhApp');
                inject();
            });
            it("configured", function() {
                expect($logProvider.debugEnabled).toHaveBeenCalledWith(true);
                expect($logProvider.debugEnabled()).toEqual(true);
            });
        });

        describe('$compileProvider', function() {
            var $compileProvider;
            beforeEach(function() {
                module(function(_$compileProvider_) {
                    $compileProvider = _$compileProvider_;
                    spyOn($compileProvider, 'debugInfoEnabled').and.callThrough();
                });
                module('clhApp');
                inject();
            });
            it("configured", function(){
                expect($compileProvider.debugInfoEnabled()).toEqual(true);
                expect($compileProvider.debugInfoEnabled).toHaveBeenCalledWith(true);
            });
        });

        describe('$httpProvider', function() {
            var $httpProvider;
            beforeEach(function () {
                module(function(_$httpProvider_) {
                    $httpProvider = _$httpProvider_;
                });
                module('clhApp');
                inject();
            });
            it('configured', function() {
                expect($httpProvider.interceptors).toContain('TokenInterceptor');
            });
        });

        describe('toastrConfig', function() {
            var toastrConfig;
            beforeEach(function() {
                module('toastr');
                module(function(_toastrConfig_) {
                    toastrConfig = _toastrConfig_;
                    spyOn(angular, 'extend').and.callThrough();
                });
                module('clhApp');
                inject();
            });
            it("configured", function() {
                expect(angular.extend).toHaveBeenCalledWith(toastrConfig, {
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
        });

        describe('$routeProvider', function() {
            var $routeProvider;
            var $route;
            beforeEach(function () {
                module('ngRoute');
                module(function(_$routeProvider_) {
                    $routeProvider = _$routeProvider_;
                    spyOn($routeProvider, 'when').and.callThrough();
                });
                module('clhApp');
                inject(function (_$route_) {
                    $route = _$route_;
                });
            });
            var spec = {
                '/login': function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.templateUrl).toBe('partials/login.html');
                        expect(route.controller).toBe('LoginCtrl');
                        expect(route.controllerAs).toBe('vm');
                        expect(route.access.requiredLogin).toBe(false);
                        expect(route.access.requiredAdmin).toBe(false);
                    });
                },
                '/register': function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.templateUrl).toBe('partials/register.html');
                        expect(route.controller).toBe('RegistrationCtrl');
                        expect(route.controllerAs).toBe('vm');
                        expect(route.access.requiredLogin).toBe(false);
                        expect(route.access.requiredAdmin).toBe(false);
                    });
                },
                '/': function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.redirectTo).toEqual('/index');
                    });
                },
                '/index': function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.templateUrl).toBe('partials/index.html');
                        expect(route.controller).toBe('IndexCtrl');
                        expect(route.controllerAs).toBe('vm');
                        expect(route.resolve.data).toBeDefined();
                        expect(route.access.requiredLogin).toBe(false);
                        expect(route.access.requiredAdmin).toBe(false);
                    });
                },
                '/news/:slug': function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.templateUrl).toBe('partials/news.html');
                        expect(route.controller).toBe('NewsCtrl');
                        expect(route.controllerAs).toBe('vm');
                        expect(route.resolve.data).toBeDefined();
                        expect(route.access.requiredLogin).toBe(false);
                        expect(route.access.requiredAdmin).toBe(false);
                    });
                },
                '/news': function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.templateUrl).toBe('partials/newsCreate.html');
                        expect(route.controller).toBe('NewsCreateCtrl');
                        expect(route.controllerAs).toBe('vm');
                        expect(route.access.requiredLogin).toBe(true);
                        expect(route.access.requiredAdmin).toBe(true);
                    });
                },
                '/users': function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.templateUrl).toBe('partials/userList.html');
                        expect(route.controller).toBe('UserListCtrl');
                        expect(route.controllerAs).toBe('vm');
                        expect(route.resolve.data).toBeDefined();
                        expect(route.access.requiredLogin).toBe(true);
                        expect(route.access.requiredAdmin).toBe(true);
                    });
                },
                '/users/:username': function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.templateUrl).toBe('partials/userDetail.html');
                        expect(route.controller).toBe('UserDetailsCtrl');
                        expect(route.controllerAs).toBe('vm');
                        expect(route.resolve.data).toBeDefined();
                        expect(route.access.requiredLogin).toBe(true);
                        expect(route.access.requiredAdmin).toBe(true);
                    });
                },
                '/user': function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.templateUrl).toBe('partials/userCreate.html');
                        expect(route.controller).toBe('UserCreateCtrl');
                        expect(route.controllerAs).toBe('vm');
                        expect(route.access.requiredLogin).toBe(true);
                        expect(route.access.requiredAdmin).toBe(true);
                    });
                },
                '/404': function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.templateUrl).toBe('partials/404.html');
                        expect(route.controller).toBe(undefined);
                        expect(route.controllerAs).toBe('vm');
                        expect(route.access.requiredLogin).toBe(false);
                        expect(route.access.requiredAdmin).toBe(false);
                    });
                },
                null: function(name) {
                    it(name, function() {
                        var route = $route.routes[name];
                        expect(route.redirectTo).toEqual('/404');
                    });
                }
            };
            var calls = 0;
            for(var route in spec) {
                if (spec.hasOwnProperty(route)) {
                    calls += 1;
                    spec[route](route);
                }
            }
            it('.when toHaveBeenCalledTimes', function() {
                expect($routeProvider.when).toHaveBeenCalledTimes(calls);
            });
        });

        describe('$routeProvider resolve', function() {
            var $route;
            var $location;
            var $rootScope;
            var $httpBackend;
            beforeEach(function () {
                module('ngRoute');

                module('clhApp');
                mockAuthenticationService = {
                    isLogged: jasmine.createSpy('isLogged').and.returnValue(true),
                    isAdmin: jasmine.createSpy('isAdmin').and.returnValue(true)
                };
                mockResolver = jasmine.createSpy('Resolver').and.returnValue([[]]);
                mockResourceService = {
                    getNews: jasmine.createSpy('getNews').and.returnValue(['news']),
                    getNewsBySlug: jasmine.createSpy('getNewsBySlug').and.returnValue('news'),
                    getUsers: jasmine.createSpy('getUsers').and.returnValue(['users']),
                    getUserDetails: jasmine.createSpy('getUserDetails').and.returnValue('user')
                };
                module(function($provide){
                    $provide.value('AuthenticationService', mockAuthenticationService);
                    $provide.value('Resolver', mockResolver);
                    $provide.value('ResourceService', mockResourceService);
                });

                inject(function (_$route_, _$location_, _$rootScope_, _$httpBackend_) {
                    $route = _$route_;
                    $location = _$location_;
                    $rootScope = _$rootScope_;
                    $httpBackend = _$httpBackend_;
                });
            });

            it('/index', function () {
                $httpBackend.expectGET('partials/index.html').respond('');
                $location.path('/index');
                $rootScope.$digest();
                expect(mockResolver).toHaveBeenCalledWith([['news']]);
                expect(mockResourceService.getNews).toHaveBeenCalledWith(true);
            });

            it('/news/:slug', function () {
                $httpBackend.expectGET('partials/news.html').respond('');
                $location.path('/news/qwe');
                $rootScope.$digest();
                expect(mockResolver).toHaveBeenCalledWith(['news']);
                expect(mockResourceService.getNewsBySlug).toHaveBeenCalledWith('qwe', true);
            });

            it('/users', function () {
                $httpBackend.expectGET('partials/userList.html').respond('');
                $location.path('/users');
                $rootScope.$digest();
                expect(mockResolver).toHaveBeenCalledWith([['users']]);
                expect(mockResourceService.getUsers).toHaveBeenCalledWith(true);
            });

            it('/users/:username', function () {
                $httpBackend.expectGET('partials/userDetail.html').respond('');
                $location.path('/users/qwe');
                $rootScope.$digest();
                expect(mockResolver).toHaveBeenCalledWith(['user']);
                expect(mockResourceService.getUserDetails).toHaveBeenCalledWith('qwe', true);
            });
        });

        describe('$rootScope.$on', function() {
            var $routeProvider;
            var $route;
            var $location;
            var $rootScope;
            var AuthenticationService;

            var $httpBackend;

            beforeEach(function() {
                module('ngRoute');
                module('clhServices');
                module(function(_$routeProvider_) {
                    $routeProvider = _$routeProvider_;
                });
                module('clhApp');
                inject(function(_$route_, _$location_, _$rootScope_, _AuthenticationService_, _$httpBackend_) {
                    $route = _$route_;
                    $location = _$location_;
                    $rootScope = _$rootScope_;
                    AuthenticationService = _AuthenticationService_;

                    $httpBackend = _$httpBackend_;
                });
                $httpBackend.whenGET('partials/login.html').respond('');
                $httpBackend.expectGET('partials/login.html');
                $httpBackend.whenGET('partials/404.html').respond('');
                $httpBackend.expectGET('partials/404.html');

                $routeProvider.when('/_test_redirectTo', {
                    redirectTo: '/_test_redirectTo_target'
                }).when('/_test_redirectTo_target', {
                    access: {
                        requiredLogin: false,
                        requiredAdmin: false
                    }
                }).when('/_test_access_missing', {
                }).when('/_test_public', {
                    access: {
                        requiredLogin: false,
                        requiredAdmin: false
                    }
                }).when('/_test_private', {
                    access: {
                        requiredLogin: true,
                        requiredAdmin: false
                    }
                }).when('/_test_admin', {
                    access: {
                        requiredLogin: true,
                        requiredAdmin: true
                    }
                });
            });

            it('redirectTo', function() {
                $location.path('/_test_redirectTo');
                $rootScope.$digest();
                expect($location.path()).toBe('/_test_redirectTo_target');
            });

            it('access field missing in route', function() {
                $location.path('/_test_access_missing');
                $rootScope.$digest();
                expect($location.path()).toBe('/404');
            });

            it('guest and !requiredLogin && !requiredAdmin', function() {
                spyOn(AuthenticationService, 'isLogged').and.returnValue(false);
                spyOn(AuthenticationService, 'isAdmin').and.returnValue(false);
                $location.path('/_test_public');
                $rootScope.$digest();
                expect($location.path()).toBe('/_test_public');
            });

            it('guest and requiredLogin && !requiredAdmin', function() {
                spyOn(AuthenticationService, 'isLogged').and.returnValue(false);
                spyOn(AuthenticationService, 'isAdmin').and.returnValue(false);
                $location.path('/_test_private');
                $rootScope.$digest();
                expect($location.path()).toBe('/login');
            });

            it('user and requiredLogin && !requiredAdmin', function() {
                spyOn(AuthenticationService, 'isLogged').and.returnValue(true);
                spyOn(AuthenticationService, 'isAdmin').and.returnValue(false);
                $location.path('/_test_private');
                $rootScope.$digest();
                expect($location.path()).toBe('/_test_private');
            });

            it('guest and requiredLogin && requiredAdmin', function() {
                spyOn(AuthenticationService, 'isLogged').and.returnValue(false);
                spyOn(AuthenticationService, 'isAdmin').and.returnValue(false);
                $location.path('/_test_admin');
                $rootScope.$digest();
                expect($location.path()).toBe('/404');
            });

            it('user and requiredLogin && requiredAdmin', function() {
                spyOn(AuthenticationService, 'isLogged').and.returnValue(true);
                spyOn(AuthenticationService, 'isAdmin').and.returnValue(false);
                $location.path('/_test_admin');
                $rootScope.$digest();
                expect($location.path()).toBe('/404');
            });

            it('admin and requiredLogin && requiredAdmin', function() {
                spyOn(AuthenticationService, 'isLogged').and.returnValue(true);
                spyOn(AuthenticationService, 'isAdmin').and.returnValue(true);
                $location.path('/_test_admin');
                $rootScope.$digest();
                expect($location.path()).toBe('/_test_admin');
            });
        });
    });
});