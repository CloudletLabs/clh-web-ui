define(['angular'], function (angular) {
    'use strict';

    /* Directives */
    var bdnDirectives = angular.module('bdnDirectives', []);

    bdnDirectives.directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]);

    return bdnDirectives;
});