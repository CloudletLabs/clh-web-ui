define(['angular'], function (angular) {
    'use strict';

    /* Filters */
    var bdnFilters = angular.module('bdnFilters', []);

    bdnFilters.filter('apiVersion', ['apiVersion', function (apiVersion) {
        return function (text) {
            return String(text).replace(/\%API_VERSION\%/mg, apiVersion);
        }
    }]);

    return bdnFilters;
});