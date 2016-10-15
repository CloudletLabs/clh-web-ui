define(['angular'], function (angular) {
    'use strict';

    var clhVersion = angular.module('clhVersion', [
        'clhFilters',
        'clhDirectives'
    ])

    clhVersion.value('version', '0.1');
    clhVersion.value('apiVersion', '1');

    return clhVersion;
});