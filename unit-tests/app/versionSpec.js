define(['angular', 'angularMock', 'app'], function(angular) {

    describe('clhVersion', function () {

        beforeEach(module("clhVersion"));

        it('default', inject(function(version, apiVersion) {
            expect(version).toEqual('0.1');
            expect(apiVersion).toEqual('1');
        }));
    });

    describe('clhDirectives', function () {
        var $compile,
            $rootScope;

        beforeEach(module("clhVersion"));
        beforeEach(module("clhDirectives"));
        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        it('default', inject(function(version, apiVersion) {
            var element = $compile("<span app-version></span>")($rootScope);
            $rootScope.$digest();
            expect(element.html()).toContain("0.1");
        }));
    });

    describe('clhFilters', function () {
        var $filter;

        beforeEach(module("clhVersion"));
        beforeEach(module("clhFilters"));

        beforeEach(inject(function(_$filter_){
            $filter = _$filter_;
        }));

        it('default', function() {
            var apiVersion = $filter('apiVersion');
            expect(apiVersion('API: v%API_VERSION%')).toEqual('API: v1');
        });
    });
});