define(['angular', 'angularMock', 'app'], function(angular) {

    describe('clhServices', function() {

        describe('Resolver', function() {
            var Resolver;

            beforeEach(module("clhApp"));
            beforeEach(inject(function($q, _Resolver_) {
                spyOn($q, 'all').and.callFake(function (promises) { return promises });
                Resolver = _Resolver_;
            }));

            it('default', function() {
                var result = Resolver({test:'test'});
                expect(result.test).toBe('test');
            });
        });

        describe('ResourceProvider', function() {
            var ResourceProvider;

            var $scope, $http, $httpBackend;

            beforeEach(function() {
                module("clhApp");
                inject(function(_ResourceProvider_, _$rootScope_, _$http_, _$httpBackend_) {
                    ResourceProvider = _ResourceProvider_;
                    $scope = _$rootScope_;
                    $http = _$http_;
                    $httpBackend = _$httpBackend_;
                });
            });

            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('request POST', function() {
                var request = {
                    method: 'POST',
                    path: '/post',
                    url: 'http://localhost:8087/api/current/post'
                };
                $httpBackend.expectPOST(request.url).respond({test: 'post'});
                var response = null;
                ResourceProvider(request).then(function (resp) {
                    response = resp;
                }, function (err) {
                    throw err;
                });
                $httpBackend.flush();
                expect(response).toEqual({test: 'post'});
            });

            it('request POST fail', function() {
                var request = {
                    method: 'POST',
                    path: '/post',
                    url: 'http://localhost:8087/api/current/post'
                };
                $httpBackend.expectPOST(request.url).respond(500, 'Test error');
                var error = null;
                ResourceProvider(request).then(function () {
                    throw new Error('Expected not to receive success response');
                }, function (err) {
                    error = err;
                });
                $httpBackend.flush();
                expect(error.data).toEqual('Test error');
            });

            it('request GET', function() {
                var request = {
                    method: 'GET',
                    path: '/get',
                    url: 'http://localhost:8087/api/current/get'
                };
                $httpBackend.expectGET(request.url).respond({test: 'get'});
                var response = null;
                ResourceProvider(request, 'key').then(function (resp) {
                    response = resp;
                }, function (err) {
                    throw err;
                });
                $httpBackend.flush();
                expect(response).toEqual({test: 'get'});

                var cached = null;
                ResourceProvider(null, 'key', true).then(function (resp) {
                    cached = resp;
                }, function (err) {
                    throw err;
                });
                $scope.$apply();
                expect(cached).toBe(response);
            });
        });

        describe('ResourceService', function() {
            var ResourceProviderMock, ResourceService;

            beforeEach(function() {
                module("clhApp");
                ResourceProviderMock = jasmine.createSpy('ResourceProvider');
                module(function($provide){
                    $provide.value('ResourceProvider', ResourceProviderMock);
                });
                inject(function(_ResourceService_) {
                    ResourceService = _ResourceService_;
                });
            });

            var check = function (name, req, key, refresh, call) {
                it(name, function () {
                    if (call) {
                        call(ResourceService[name]);
                    } else {
                        ResourceService[name]();
                    }
                    if (refresh !== undefined) {
                        expect(ResourceProviderMock).toHaveBeenCalledWith(req, key, !refresh);
                    } else if (key) {
                        expect(ResourceProviderMock).toHaveBeenCalledWith(req, key);
                    } else {
                        expect(ResourceProviderMock).toHaveBeenCalledWith(req);
                    }
                });
            };

            [
                {
                    name: 'login',
                    req: {
                        method: 'POST',
                        path: '/auth_token',
                        headers: {
                            Authorization: 'Basic xyz'
                        }
                    },
                    call: function (resourceService) {
                        return resourceService('Basic xyz')
                    }
                },
                {
                    name: 'register',
                    req: {
                        method: 'POST',
                        path: '/users',
                        data: 'user'
                    },
                    call: function (resourceService) {
                        return resourceService('user')
                    }
                },
                {
                    name: 'getCurrentUser',
                    req: {
                        method: 'GET',
                        path: '/user'
                    },
                    key: 'currentUser'
                },
                {
                    name: 'getUsers',
                    req: {
                        method: 'GET',
                        path: '/users'
                    },
                    refresh: true,
                    key: 'users',
                    call: function (resourceService) {
                        return resourceService(true)
                    }
                },
                {
                    name: 'getUserDetails',
                    req: {
                        method: 'GET',
                        path: '/users/username'
                    },
                    refresh: true,
                    key: 'user_username',
                    call: function (resourceService) {
                        return resourceService('username', true)
                    }
                },
                {
                    name: 'createUser',
                    req: {
                        method: 'POST',
                        path: '/users',
                        data: 'user'
                    },
                    call: function (resourceService) {
                        return resourceService('user')
                    }
                },
                {
                    name: 'updateUser',
                    req: {
                        method: 'PUT',
                        path: '/users/username',
                        data: 'user'
                    },
                    call: function (resourceService) {
                        return resourceService('username', 'user')
                    }
                },
                {
                    name: 'deleteUser',
                    req: {
                        method: 'DELETE',
                        path: '/users/username'
                    },
                    call: function (resourceService) {
                        return resourceService('username')
                    }
                },
                {
                    name: 'getNews',
                    req: {
                        method: 'GET',
                        path: '/news'
                    },
                    refresh: true,
                    key: 'news',
                    call: function (resourceService) {
                        return resourceService(true)
                    }
                },
                {
                    name: 'getNewsBySlug',
                    req: {
                        method: 'GET',
                        path: '/news/slug'
                    },
                    refresh: true,
                    key: 'news_slug',
                    call: function (resourceService) {
                        return resourceService('slug', true)
                    }
                },
                {
                    name: 'createNews',
                    req: {
                        method: 'POST',
                        path: '/news',
                        data: 'news'
                    },
                    call: function (resourceService) {
                        return resourceService('news')
                    }
                },
                {
                    name: 'updateNews',
                    req: {
                        method: 'PUT',
                        path: '/news/slug',
                        data: 'news'
                    },
                    call: function (resourceService) {
                        return resourceService('slug', 'news')
                    }
                },
                {
                    name: 'deleteNews',
                    req: {
                        method: 'DELETE',
                        path: '/news/slug'
                    },
                    call: function (resourceService) {
                        return resourceService('slug')
                    }
                }
            ].forEach(function (its) {
                check(its.name, its.req, its.key, its.refresh, its.call);
            });
        });

        describe('TokenInterceptor', function() {
            var $q, $location, localStorageService, TokenInterceptor;

            beforeEach(module("clhApp"));
            beforeEach(inject(function(_$q_, _$location_, _localStorageService_, _TokenInterceptor_) {
                $q = _$q_;
                $location = _$location_;
                localStorageService = _localStorageService_;
                TokenInterceptor = _TokenInterceptor_;
            }));

            it('request should not spoil existing headers', function() {
                spyOn(localStorageService, 'get').and.returnValue('test');
                var result = TokenInterceptor.request({headers: {test: 'test'}});
                expect(result).toEqual({
                    headers: {
                        test: 'test',
                        Authorization: 'Bearer test'
                    }
                });
            });

            it('request should create headers if missing', function() {
                spyOn(localStorageService, 'get').and.returnValue('test');
                var result = TokenInterceptor.request({});
                expect(result).toEqual({
                    headers: {
                        Authorization: 'Bearer test'
                    }
                });
            });

            it('request should do nothing if localStorageService do not have auth_token', function() {
                spyOn(localStorageService, 'get').and.returnValue(null);
                var result = TokenInterceptor.request({headers: {test: 'test'}});
                expect(result).toEqual({
                    headers: {
                        test: 'test'
                    }
                });
            });

            it('response should return data if any', function() {
                var result = TokenInterceptor.response({test: 'test'});
                expect(result).toEqual({test: 'test'});
            });

            it('response should call $q.when if no data', function() {
                spyOn($q, 'when');
                TokenInterceptor.response(null);
                expect($q.when).toHaveBeenCalledWith(null);
            });

            it('responseError should call $q.reject', function() {
                var res = {
                    config: {
                        url: '/auth_token'
                    },
                    status: 500
                };
                spyOn($q, 'reject');
                TokenInterceptor.responseError(res);
                expect($q.reject).toHaveBeenCalledWith(res);
            });

            it('responseError should cleanup credentials if this is not /login and response is 401', function() {
                var res = {
                    config: {
                        url: '/test'
                    },
                    status: 401
                };
                spyOn($q, 'reject');
                spyOn(localStorageService, 'clearAll');
                spyOn($location, 'path');
                TokenInterceptor.responseError(res);
                expect($q.reject).toHaveBeenCalledWith(res);
                expect(localStorageService.clearAll).toHaveBeenCalled();
                expect($location.path).toHaveBeenCalledWith('/login');
            });
        });

        describe('CryptoJSService', function() {
            var CryptoJSService;

            beforeEach(module("clhApp"));
            beforeEach(inject(function(_CryptoJSService_) {
                CryptoJSService = _CryptoJSService_;
            }));

            it('default', function() {
                expect(CryptoJSService).toBeDefined();
                var password = CryptoJSService.PBKDF2('data', 'salt', {keySize: 256 / 32}).toString();
                expect(password).toEqual('20862b3a9436c571efc448b7a8629d9cb91d08638006f7c28820e26e707096ac');
            });
        });

        describe('AuthenticationService', function() {
            var $location, localStorageService, ResourceService, AuthenticationService, toastr;

            var defaultUserResponse = {
                username: 'usr',
                password: 'a51db16fb0b78a6cfbebe5f43a32313d251a6b89166d60586f85cc79626c1c51'
            };
            var basicAuth = 'Basic dXNyOmE1MWRiMTZmYjBiNzhhNmNmYmViZTVmNDNhMzIzMTNkMjUxYTZiODkxNjZkNjA1ODZmODVjYzc5NjI2YzFjNTE=';

            beforeEach(module("clhApp"));
            beforeEach(inject(function(_$location_, _localStorageService_, _ResourceService_, _AuthenticationService_,
                                       _toastr_) {
                $location = _$location_;
                localStorageService = _localStorageService_;
                ResourceService = _ResourceService_;
                AuthenticationService = _AuthenticationService_;
                toastr = _toastr_;
            }));

            it('encryptUserPassword should delete plainTextPassword', function() {
                var user = {
                    password: 'test',
                    plainTextPassword: 'test'
                };
                AuthenticationService.encryptUserPassword(user);
                expect(user).toEqual({
                    password: 'test'
                });
            });

            it('encryptUserPassword should encrypt plainTextPassword if it changed', function() {
                var user = {
                    username: 'usr',
                    password: 'blabla',
                    plainTextPassword: 'pwd'
                };
                AuthenticationService.encryptUserPassword(user);
                expect(user).toEqual(defaultUserResponse);
            });

            it('doLogin happy path', function() {
                spyOn($location, 'path');
                spyOn(localStorageService, 'set');
                spyOn(ResourceService, 'login').and.callFake(mockPromise({auth_token: 'test_token'}));
                spyOn(ResourceService, 'getCurrentUser').and.callFake(mockPromise({test: 'test'}));
                AuthenticationService.doLogin('usr', 'pwd');
                expect(ResourceService.login).toHaveBeenCalledWith(basicAuth);
                expect(localStorageService.set).toHaveBeenCalledWith('auth_token', 'test_token');
                expect(localStorageService.set).toHaveBeenCalledWith('user', {test: 'test'});
                expect($location.path).toHaveBeenCalledWith('/index');
            });

            it('doLogin failed', function() {
                spyOn(toastr, 'error');
                spyOn(ResourceService, 'login').and.callFake(mockPromise({status: 401}, true));
                AuthenticationService.doLogin('usr', 'pwd');
                expect(ResourceService.login).toHaveBeenCalledWith(basicAuth);
                expect(toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('doLogin server error', function() {
                spyOn(toastr, 'error');
                spyOn(ResourceService, 'login').and.callFake(mockPromise({data: {message: '123'}}, true));
                AuthenticationService.doLogin('usr', 'pwd');
                expect(ResourceService.login).toHaveBeenCalledWith(basicAuth);
                expect(toastr.error).toHaveBeenCalledWith('123');
            });

            it('doLogin unable to get user object', function() {
                spyOn(toastr, 'error');
                spyOn($location, 'path');
                spyOn(localStorageService, 'set');
                spyOn(localStorageService, 'clearAll');
                spyOn(ResourceService, 'login').and.callFake(mockPromise({auth_token: 'test_token'}));
                spyOn(ResourceService, 'getCurrentUser').and.callFake(mockPromise({data: {message: '123'}}, true));
                AuthenticationService.doLogin('usr', 'pwd');
                expect(ResourceService.login).toHaveBeenCalledWith(basicAuth);
                expect(localStorageService.set).toHaveBeenCalledWith('auth_token', 'test_token');
                expect(localStorageService.clearAll).toHaveBeenCalled();
                expect($location.path).toHaveBeenCalledWith('/login');
                expect(toastr.error).toHaveBeenCalledWith('123');
            });

            it('doRegister happy path', function() {
                spyOn(toastr, 'success');
                var doLogin = jasmine.createSpy('doLogin');
                spyOn(ResourceService, 'register').and.callFake(mockPromise({}));
                AuthenticationService.doRegister('usr', 'User', 'email', 'pwd', doLogin);
                expect(ResourceService.register).toHaveBeenCalledWith({
                    username: defaultUserResponse.username,
                    name: 'User',
                    email: 'email',
                    password: defaultUserResponse.password
                });
                expect(doLogin).toHaveBeenCalledWith(defaultUserResponse.username, 'pwd');
                expect(toastr.success).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('doRegister server error', function() {
                spyOn(toastr, 'error');
                spyOn(ResourceService, 'register').and.callFake(mockPromise({data: {message: '123'}}, true));
                AuthenticationService.doRegister('usr', 'User', 'email', 'pwd', null);
                expect(ResourceService.register).toHaveBeenCalledWith({
                    username: defaultUserResponse.username,
                    name: 'User',
                    email: 'email',
                    password: defaultUserResponse.password
                });
                expect(toastr.error).toHaveBeenCalledWith('123');
            });

            it('isLogged true', function() {
                spyOn(localStorageService, 'get').and.returnValue('test');
                var isLogged = AuthenticationService.isLogged();
                expect(isLogged).toBeTruthy();
            });

            it('isLogged false', function() {
                spyOn(localStorageService, 'get').and.returnValue(null);
                var isLogged = AuthenticationService.isLogged();
                expect(isLogged).toBeFalsy();
            });

            it('isAdmin true', function() {
                spyOn(localStorageService, 'get').and.returnValue({
                    roles: [
                        {
                            roleId: 'USER'
                        },
                        {
                            roleId: 'ADMIN'
                        }
                    ]
                });
                var isAdmin = AuthenticationService.isAdmin();
                expect(isAdmin).toBeTruthy();
            });

            it('isAdmin false', function() {
                spyOn(localStorageService, 'get').and.returnValue({
                    roles: [
                        {
                            roleId: 'USER'
                        }
                    ]
                });
                var isLogged = AuthenticationService.isAdmin();
                expect(isLogged).toBeFalsy();
            });
        });

    });

});