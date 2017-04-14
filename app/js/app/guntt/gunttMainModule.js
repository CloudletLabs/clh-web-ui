define([
    'angular',
    'gunttUserAndResourcesCtrl',
    'gunttDateAndTimeCtrl',
    'gunttConstructorServices',
    'gunttDirecrives'
], function (angular) {
    'use strict';

    /* DEFINE GUNTT MAIN MODULE */
    var gunttMainModule = angular.module('gunttMainModule', [
        'gunttUserAndResourcesCtrlModule',
        'gunttDateAndTimeCtrlModule',
        'gunttConstructorServicesModule',
        'gunttDirectivesModule'
    ]);

    return gunttMainModule;
});
