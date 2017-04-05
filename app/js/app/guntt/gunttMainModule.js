define([
    'angular',
    'gunttUserAndResourcesCtrl',
    'gunttDateAndTimeCtrl',
    'gunttDirecrives'
], function (angular) {
    'use strict';

    /* DEFINE GUNTT MAIN MODULE */
    var gunttMainModule = angular.module('gunttMainModule', [
        'gunttUserAndResourcesCtrlModule',
        'gunttDateAndTimeCtrlModule',
        'gunttDirectivesModule'
    ]);

    return gunttMainModule;
});
