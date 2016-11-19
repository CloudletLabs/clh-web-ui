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

    });

});