define([
    'angular',
    'gunttUserAndResourcesCtrl'
], function (angular) {
    'use strict';

    /* DEFINE GUNTT MAIN MODULE */
    var gunttMainModule = angular.module('gunttMainModule', [
        'gunttUserAndResourcesCtrlModule'
    ]);

    return gunttMainModule;
});
