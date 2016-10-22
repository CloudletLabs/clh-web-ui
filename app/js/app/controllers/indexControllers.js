define(['angular'], function (angular) {
    'use strict';

    /* Controllers */

    var clhIndexControllers = angular.module('clhIndexControllers', []);

    clhIndexControllers.controller('NavCtrl', ['$location', 'localStorageService', 'AuthenticationService', NavCtrl]);
    clhIndexControllers.controller('IndexCtrl', ['$sce', 'ResourceService', 'data', IndexCtrl]);

    /**
     * Controller for navigation panel
     */
    function NavCtrl($location, localStorageService, AuthenticationService) {
        var vm = this;
        vm.$location = $location;
        vm.localStorageService = localStorageService;
        vm.isAuthenticated = AuthenticationService.isLogged();
        vm.isAdmin = AuthenticationService.isAdmin();
        vm.currentUser = localStorageService.get('user');
    }

    /**
     * When user press logout button
     */
    NavCtrl.prototype.logout = function () {
        var vm = this;
        vm.localStorageService.clearAll();
        vm.$location.path("/login");
    };

    /**
     * Controller for an index page
     */
    function IndexCtrl($sce, ResourceService, data) {
        var vm = this;
        vm.ResourceService = ResourceService;

        vm.news = data[0];
        // Render markdown to html
        vm.news.forEach(function (news) {
            news.html = $sce.trustAsHtml(markdown.toHTML(news.text));
        });
    }

    return clhIndexControllers;
});