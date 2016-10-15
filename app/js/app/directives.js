define(['angular'], function (angular) {
    'use strict';

    /* Directives */
    var clhDirectives = angular.module('clhDirectives', []);

    clhDirectives.directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]);

    return clhDirectives;
});