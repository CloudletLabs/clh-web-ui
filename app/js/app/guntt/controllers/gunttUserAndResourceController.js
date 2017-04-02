define(['angular'], function (angular) {
    'use strict';

    /* DEFINE USER AND RESOURCES CONTROLLER MODULE */
    var gunttUserAndResourcesCtrlModule = angular.module('gunttUserAndResourcesCtrlModule', ['clhServices']);

    /*USER AND RESOURCES APP CONTROLLER **START** */
    gunttUserAndResourcesCtrlModule.controller('gunttUserAndResourcesCtrl', function ($scope, $window, $document, $log, toastr, ResourceService) {
        //Init Local var's
        $scope.user = new Object();

        //get user Data Model
        $scope.gunttUserData = ResourceService.getCurrentUser().then(function (data) {
            $scope.user = data;
            $log.log(data);
            return data;
        });

    });
    /*USER AND RESOURCES APP CONTROLLER **END** */

    return gunttUserAndResourcesCtrlModule;
});