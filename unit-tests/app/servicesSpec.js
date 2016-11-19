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

        describe('ResourceService', function() {
            var ResourceService;

            var mockCallbacks;
            var mockData = {test:'test'};
            var mockData1 = {test:'test1'};

            var http;
            var mockHttp, mockResolve, mockReject, mockWhen;

            beforeEach(function() {
                module("clhApp");

                mockCallbacks = {
                    done: jasmine.createSpy('mockCallbacks.done'),
                    err: jasmine.createSpy('mockCallbacks.err')
                };
                http = {
                    success: function (callback) {
                        http.successCallback = callback;
                        return http;
                    },
                    error: function (callback) {
                        http.errorCallback = callback;
                        return http;
                    }
                };
                mockHttp = jasmine.createSpy('$http').and.callFake(function (req) {
                    http.req = req;
                    return http;
                });
                mockResolve = jasmine.createSpy('deferred.resolve').and.callFake(function (data) {
                    mockDeferred.done(data);
                });
                mockReject = jasmine.createSpy('deferred.reject').and.callFake(function (err) {
                    mockDeferred.err(err);
                });
                var mockDeferred = {
                    promise: {
                        then: function (done, err) {
                            mockDeferred.done = done;
                            mockDeferred.err = err;
                            http.res.status ?
                                http.errorCallback(http.res.data, http.res.status) : http.successCallback(http.res);
                        }
                    },
                    resolve: mockResolve,
                    reject: mockReject
                };
                mockWhen = jasmine.createSpy('$q.when').and.callFake(function (data) {
                    return {
                        then: function (done, err) {
                            done(data);
                        }
                    }
                });
                var mockQ = {
                    defer: function () {
                        return mockDeferred;
                    },
                    when: mockWhen
                };
                module(function($provide){
                    $provide.value('$http', mockHttp);
                    $provide.value('$q', mockQ);
                });

                inject(function(_ResourceService_) {
                    ResourceService = _ResourceService_;
                });
            });

            var successCheck = function (name, req, callResourceService, cachedCallResourceService) {
                it(name, function() {
                    http.res = mockData;
                    var promise = callResourceService(ResourceService[name]);
                    expect(mockHttp).toHaveBeenCalledWith(req);
                    expect(promise).toBeDefined();
                    promise.then(mockCallbacks.done, mockCallbacks.err);
                    expect(mockCallbacks.done).toHaveBeenCalledWith(mockData);
                    expect(mockCallbacks.err).not.toHaveBeenCalled();
                    expect(mockResolve).toHaveBeenCalledWith(mockData);
                    expect(mockReject).not.toHaveBeenCalled();
                    expect(mockWhen).not.toHaveBeenCalled();

                    mockHttp.calls.reset();
                    mockCallbacks.done.calls.reset();
                    mockCallbacks.err.calls.reset();
                    mockResolve.calls.reset();
                    mockReject.calls.reset();
                    mockWhen.calls.reset();

                    http.res = mockData1;
                    var promise = callResourceService(ResourceService[name]);
                    expect(mockHttp).toHaveBeenCalledWith(req);
                    expect(promise).toBeDefined();
                    promise.then(mockCallbacks.done, mockCallbacks.err);
                    expect(mockCallbacks.done).toHaveBeenCalledWith(mockData1);
                    expect(mockCallbacks.err).not.toHaveBeenCalled();
                    expect(mockResolve).toHaveBeenCalledWith(mockData1);
                    expect(mockReject).not.toHaveBeenCalled();
                    expect(mockWhen).not.toHaveBeenCalled();
                });
                if (cachedCallResourceService) {
                    it(name + ' cached', function () {
                        http.res = mockData;
                        var promise = cachedCallResourceService(ResourceService[name]);
                        expect(mockHttp).toHaveBeenCalledWith(req);
                        expect(promise).toBeDefined();
                        promise.then(mockCallbacks.done, mockCallbacks.err);
                        expect(mockCallbacks.done).toHaveBeenCalledWith(mockData);
                        expect(mockCallbacks.err).not.toHaveBeenCalled();
                        expect(mockResolve).toHaveBeenCalledWith(mockData);
                        expect(mockReject).not.toHaveBeenCalled();
                        expect(mockWhen).not.toHaveBeenCalled();

                        mockHttp.calls.reset();
                        mockCallbacks.done.calls.reset();
                        mockCallbacks.err.calls.reset();
                        mockResolve.calls.reset();
                        mockReject.calls.reset();
                        mockWhen.calls.reset();

                        http.res = mockData1;
                        promise = cachedCallResourceService(ResourceService[name]);
                        expect(mockHttp).not.toHaveBeenCalled();
                        expect(promise).toBeDefined();
                        promise.then(mockCallbacks.done, mockCallbacks.err);
                        expect(mockCallbacks.done).toHaveBeenCalledWith(mockData);
                        expect(mockCallbacks.err).not.toHaveBeenCalled();
                        expect(mockResolve).not.toHaveBeenCalled();
                        expect(mockReject).not.toHaveBeenCalled();
                        expect(mockWhen).toHaveBeenCalledWith(mockData);

                        mockHttp.calls.reset();
                        mockCallbacks.done.calls.reset();
                        mockCallbacks.err.calls.reset();
                        mockResolve.calls.reset();
                        mockReject.calls.reset();
                        mockWhen.calls.reset();

                        promise = callResourceService(ResourceService[name]);
                        expect(mockHttp).toHaveBeenCalledWith(req);
                        expect(promise).toBeDefined();
                        promise.then(mockCallbacks.done, mockCallbacks.err);
                        expect(mockCallbacks.done).toHaveBeenCalledWith(mockData1);
                        expect(mockCallbacks.err).not.toHaveBeenCalled();
                        expect(mockResolve).toHaveBeenCalledWith(mockData1);
                        expect(mockReject).not.toHaveBeenCalled();
                        expect(mockWhen).not.toHaveBeenCalled();
                    });
                }
            };

            var failCheck = function (name, req, callResourceService) {
                it(name + ' fail', function() {
                    http.res = {
                        status: 401,
                        data: mockData
                    };
                    var promise = callResourceService(ResourceService[name]);
                    expect(mockHttp).toHaveBeenCalledWith(req);
                    expect(promise).toBeDefined();
                    promise.then(mockCallbacks.done, mockCallbacks.err);
                    expect(mockCallbacks.done).not.toHaveBeenCalled();
                    expect(mockCallbacks.err).toHaveBeenCalledWith(http.res);
                });
            };

            var baseApiUrl = 'http://localhost:8087/api/current';
            [
                {
                    name: 'login',
                    req: {
                        method: 'POST',
                        url: baseApiUrl + '/auth_token',
                        data: mockData
                    },
                    callResourceService: function(resourceService) {
                        return resourceService(mockData)
                    }
                },
                {
                    name: 'register',
                    req: {
                        method: 'POST',
                        url: baseApiUrl + '/users',
                        data: mockData
                    },
                    callResourceService: function(resourceService) {
                        return resourceService(mockData)
                    }
                },
                {
                    name: 'getCurrentUser',
                    req: {
                        method: 'GET',
                        url: baseApiUrl + '/user',
                        data: null
                    },
                    callResourceService: function(resourceService) {
                        return resourceService()
                    }
                },
                {
                    name: 'getUsers',
                    req: {
                        method: 'GET',
                        url: baseApiUrl + '/users',
                        data: null
                    },
                    callResourceService: function(resourceService) {
                        return resourceService(true)
                    },
                    cachedCallResourceService: function(resourceService) {
                        return resourceService(false)
                    }
                },
                {
                    name: 'getUserDetails',
                    req: {
                        method: 'GET',
                        url: baseApiUrl + '/users/test',
                        data: null
                    },
                    callResourceService: function(resourceService) {
                        return resourceService('test', true)
                    },
                    cachedCallResourceService: function(resourceService) {
                        return resourceService('test', false)
                    }
                },
                {
                    name: 'createUser',
                    req: {
                        method: 'POST',
                        url: baseApiUrl + '/users',
                        data: mockData
                    },
                    callResourceService: function(resourceService) {
                        return resourceService(mockData)
                    }
                },
                {
                    name: 'updateUser',
                    req: {
                        method: 'PUT',
                        url: baseApiUrl + '/users/test',
                        data: mockData
                    },
                    callResourceService: function(resourceService) {
                        return resourceService('test', mockData)
                    }
                },
                {
                    name: 'deleteUser',
                    req: {
                        method: 'DELETE',
                        url: baseApiUrl + '/users/test',
                        data: null
                    },
                    callResourceService: function(resourceService) {
                        return resourceService('test')
                    }
                },
                {
                    name: 'getNews',
                    req: {
                        method: 'GET',
                        url: baseApiUrl + '/news',
                        data: null
                    },
                    callResourceService: function(resourceService) {
                        return resourceService(true)
                    },
                    cachedCallResourceService: function(resourceService) {
                        return resourceService(false)
                    }
                },
                {
                    name: 'getNewsBySlug',
                    req: {
                        method: 'GET',
                        url: baseApiUrl + '/news/test',
                        data: null
                    },
                    callResourceService: function(resourceService) {
                        return resourceService('test', true)
                    },
                    cachedCallResourceService: function(resourceService) {
                        return resourceService('test', false)
                    }
                },
                {
                    name: 'createNews',
                    req: {
                        method: 'POST',
                        url: baseApiUrl + '/news',
                        data: mockData
                    },
                    callResourceService: function(resourceService) {
                        return resourceService(mockData)
                    }
                },
                {
                    name: 'updateNews',
                    req: {
                        method: 'PUT',
                        url: baseApiUrl + '/news/test',
                        data: mockData
                    },
                    callResourceService: function(resourceService) {
                        return resourceService('test', mockData)
                    }
                },
                {
                    name: 'deleteNews',
                    req: {
                        method: 'DELETE',
                        url: baseApiUrl + '/news/test',
                        data: null
                    },
                    callResourceService: function(resourceService) {
                        return resourceService('test')
                    }
                }
            ].forEach(function (it) {
                successCheck(it.name, it.req,
                    it.callResourceService, it.cachedCallResourceService);
                failCheck(it.name, it.req, it.callResourceService);
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

            it('responseError should do nothing if 401 but request was /auth_token', function() {
                var res = {
                    config: {
                        url: '/auth_token'
                    },
                    status: 401
                };
                spyOn($q, 'reject');
                spyOn(localStorageService, 'clearAll');
                spyOn($location, 'path');
                TokenInterceptor.responseError(res);
                expect($q.reject).toHaveBeenCalledWith(res);
                expect(localStorageService.clearAll).not.toHaveBeenCalled();
                expect($location.path).not.toHaveBeenCalled();
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
                expect(ResourceService.login).toHaveBeenCalledWith(defaultUserResponse);
                expect(localStorageService.set).toHaveBeenCalledWith('auth_token', 'test_token');
                expect(localStorageService.set).toHaveBeenCalledWith('user', {test: 'test'});
                expect($location.path).toHaveBeenCalledWith('/index');
            });

            it('doLogin failed', function() {
                spyOn(toastr, 'error');
                spyOn(ResourceService, 'login').and.callFake(mockPromise({status: 401}, true));
                AuthenticationService.doLogin('usr', 'pwd');
                expect(ResourceService.login).toHaveBeenCalledWith(defaultUserResponse);
                expect(toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('doLogin server error', function() {
                spyOn(toastr, 'error');
                spyOn(ResourceService, 'login').and.callFake(mockPromise({data: {message: '123'}}, true));
                AuthenticationService.doLogin('usr', 'pwd');
                expect(ResourceService.login).toHaveBeenCalledWith(defaultUserResponse);
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
                expect(ResourceService.login).toHaveBeenCalledWith(defaultUserResponse);
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