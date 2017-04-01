define([
    'angular',
    'gunttUserAndResourcesCtrl',
    'gunttDirecrives'
], function (angular) {
    'use strict';

    /* DEFINE GUNTT MAIN MODULE */
    var gunttMainModule = angular.module('gunttMainModule', [
        'gunttUserAndResourcesCtrlModule',
        'gunttDirectivesModule'
    ]);

    return gunttMainModule;
});
