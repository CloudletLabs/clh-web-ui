define(['angularMock', 'app'], function(angular) {

    describe('clhIndexControllers', function() {
        var $controller;

        beforeEach(module('clhApp'));
        beforeEach(inject(function(_$controller_){
            $controller = _$controller_;
        }));

        describe('NavCtrl', function() {
            var vm;

            beforeEach(function() {
                vm = $controller('NavCtrl', { });
            });

            it('default', function() {
                expect(vm).toBeDefined();
                expect(vm.$location).toBeDefined();
                expect(vm.localStorageService).toBeDefined();
                expect(vm.isAuthenticated).toEqual(false);
                expect(vm.isAdmin).toEqual(false);
                expect(vm.currentUser).toBeNull();
            });

            it('logout', function() {
                vm.localStorageService.set('test', 'test');
                expect(vm.localStorageService.get('test')).toBe('test');

                vm.$location.path('/index');
                expect(vm.$location.path()).toBe('/index');

                vm.logout();
                expect(vm.localStorageService.get('test')).toBeNull();
                expect(vm.$location.path()).toBe('/login');
            });

        });

        describe('IndexCtrl', function() {
            var vm;

            beforeEach(function() {
                vm = $controller('IndexCtrl', { data: [[ { text: '*test*' } ]] });
            });

            it('default', function() {
                expect(vm).toBeDefined();
                expect(vm.ResourceService).toBeDefined();
                expect(vm.news).toBeDefined();
                expect(vm.news[0].html.toString()).toBe('<p><em>test</em></p>');
            });

        });
    });

});