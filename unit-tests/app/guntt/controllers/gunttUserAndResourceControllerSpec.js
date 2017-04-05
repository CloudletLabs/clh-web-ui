define(['angular', 'angularMock', 'app'], function (angular) {
    describe("gunttUserAndResourcesCtrlModule Load", function () {
        var $controller;
        var $scope;
        var createController;

        beforeEach(module("gunttUserAndResourcesCtrlModule"));

        beforeEach(inject(function ($injector) {
            $controller = $injector.get('$controller');
            $scope = $injector.get('$rootScope');

            createController = function () {
                return $controller('gunttUserAndResourcesCtrl', {'$scope': $scope});
            };
        }));

    });
});