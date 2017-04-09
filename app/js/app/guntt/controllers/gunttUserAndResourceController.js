define(['angular'], function (angular) {
    'use strict';

    /* DEFINE GUNTT USER AND RESOURCES CONTROLLER MODULE */
    var gunttUserAndResourcesCtrlModule = angular.module('gunttUserAndResourcesCtrlModule', ['clhServices']);

    /*USER AND RESOURCES APP CONTROLLER **START** */
    gunttUserAndResourcesCtrlModule.controller('gunttUserAndResourcesCtrl',
        function ($scope, $window, $document, $log, toastr, ResourceService) {

            //User constructor
            function GunttUser() {
                this.initData = null;
            }
            //User constructor methods
            GunttUser.prototype.getUserInitData = function () {
                var self = this;
                ResourceService.getCurrentUser().then(function (data) {
                    self.initData = data;
                });
            };

            //create user
            $scope.user = new GunttUser();
            $scope.user.getUserInitData();

        });
    /*USER AND RESOURCES APP CONTROLLER **END** */

    return gunttUserAndResourcesCtrlModule;
});