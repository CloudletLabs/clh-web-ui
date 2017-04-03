define(['angular'], function (angular) {
    'use strict';

    /* DEFINE USER AND RESOURCES CONTROLLER MODULE */
    var gunttUserAndResourcesCtrlModule = angular.module('gunttUserAndResourcesCtrlModule', ['clhServices']);

    /*USER AND RESOURCES APP CONTROLLER **START** */
    gunttUserAndResourcesCtrlModule.controller('gunttUserAndResourcesCtrl',
        function ($scope, $window, $document, $log, toastr, ResourceService) {
            //INIT LOCAL VAR'S
            $scope.user = new Object();

            //GET USER DATA MODEL
            $scope.gunttUserData = ResourceService.getCurrentUser().then(function (data) {
                $scope.user = data;
                $log.log(data);
                return data;
            });

        });
    /*USER AND RESOURCES APP CONTROLLER **END** */

    return gunttUserAndResourcesCtrlModule;
});