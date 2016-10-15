define(['angular'], function (angular) {
    'use strict';

    /* Filters */
    var clhFilters = angular.module('clhFilters', []);

    clhFilters.filter('apiVersion', ['apiVersion', function (apiVersion) {
        return function (text) {
            return String(text).replace(/\%API_VERSION\%/mg, apiVersion);
        }
    }]);

    return clhFilters;
});