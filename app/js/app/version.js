define(['angular'], function (angular) {
    'use strict';

    var bdnVersion = angular.module('bdnVersion', [
        'bdnFilters',
        'bdnDirectives'
    ])

    bdnVersion.value('version', '0.1');
    bdnVersion.value('apiVersion', '1');

    return bdnVersion;
});