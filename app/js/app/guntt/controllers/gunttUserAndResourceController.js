define(['angular'], function (angular) {
    'use strict';

    /* DEFINE GUNTT USER AND RESOURCES CONTROLLER MODULE */
    var gunttUserAndResourcesCtrlModule = angular.module('gunttUserAndResourcesCtrlModule', ['clhServices', 'gunttConstructorServicesModule']);

    /*USER AND RESOURCES APP CONTROLLER **START** */
    gunttUserAndResourcesCtrlModule.controller('gunttUserAndResourcesCtrl',
        function ($scope, $window, $document, $log, toastr, ResourceService, GunttUserService) {

            //create user
            $scope.user = GunttUserService;
            $scope.user.getUserInitData();

        });
    /*USER AND RESOURCES APP CONTROLLER **END** */

    return gunttUserAndResourcesCtrlModule;
});