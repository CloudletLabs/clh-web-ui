define(['angular'], function (angular) {
    'use strict';

    /* DEFINE GUNTT TIME AND DATE CONTROLLER MODULE */
    var gunttTimeAndDateCtrlModule = angular.module('gunttDateAndTimeCtrlModule', ['clhServices']);

    /*TIME AND DATE APP CONTROLLER **START** */
    gunttTimeAndDateCtrlModule.controller('gunttDateAndTimeCtrl',
        function ($scope, $interval, $log, toastr, $window, $document) {

    });
    /*TIME AND DATE APP CONTROLLER **END** */

    return gunttTimeAndDateCtrlModule;
});