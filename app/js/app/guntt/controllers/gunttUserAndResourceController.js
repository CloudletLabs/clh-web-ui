define(['angular'], function (angular) {
    'use strict';

    /* DEFINE USER AND RESOURCES CONTROLLER MODULE */
    var gunttUserAndResourcesCtrlModule = angular.module('gunttUserAndResourcesCtrlModule', []);

    /*USER AND RESOURCES APP CONTROLLER **START** */
    gunttUserAndResourcesCtrlModule.controller('gunttUserAndResourcesCtrl', function ($scope, $window, $document, $log, toastr) {

        toastr.success('TEST: Wellcome to Guntt!');

        /*USER AND RESOURCES APP CONTROLLER **END** */

        return gunttUserAndResourcesCtrlModule;
    });
});