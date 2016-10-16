define(['angularMock', 'app'], function(angular) {

    describe('NavCtrl', function() {
        beforeEach(module('clhApp'));
        var $controller;

        beforeEach(inject(function(_$controller_){
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $controller = _$controller_;
        }));

        describe('firstTest', function() {
            var controller;

            beforeEach(function() {
                controller = $controller('NavCtrl', { });
            });

            it('helloworld', function() {
                expect(controller.isAuthenticated).toEqual(false);
            });

        });
    });

});