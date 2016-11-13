define(['angular'], function (angular) {
    'use strict';

    /* Controllers */

    var clhNewsControllers = angular.module('clhNewsControllers', []);

    clhNewsControllers.controller('NewsCtrl', ['$location', '$sce', 'AuthenticationService', 'ResourceService', 'data', 'toastr', NewsCtrl]);
    clhNewsControllers.controller('NewsCreateCtrl', ['$location', 'ResourceService', 'toastr', NewsCreateCtrl]);

    /**
     * Controller for news
     */
    function NewsCtrl($location, $sce, AuthenticationService, ResourceService, data, toastr) {
        var vm = this;
        vm.$location = $location;
        vm.$sce = $sce;
        vm.isAdmin = AuthenticationService.isAdmin();
        vm.ResourceService = ResourceService;
        vm.toastr = toastr;

        vm.currentNews = data[0];
        // If a news with this slug not found on the server
        if (!vm.currentNews) {
            vm.$location.path("/404");
            vm.toastr.error("This news no longer exist!");
            return;
        }
        // Render markdown to html
        vm.currentNews.html = $sce.trustAsHtml(markdown.toHTML(data[0].text));
    }

    /**
     * Start updating current news
     */
    NewsCtrl.prototype.editCurrentNews = function () {
        var vm = this;
        vm.currentNews.modify = true;
        vm.currentNews.oldSlug = vm.currentNews.slug;
    };

    /**
     * Update current news handler
     */
    NewsCtrl.prototype.updateCurrentNews = function () {
        var vm = this;

        var newsToSave = {
            subject: vm.currentNews.subject,
            text: vm.currentNews.text
        };
        // When done editing - request to the server
        vm.ResourceService.updateNews(vm.currentNews.oldSlug, newsToSave).then(function (news) {
            // Updated, save new instance and render it
            vm.currentNews = news;
            vm.currentNews.html = vm.$sce.trustAsHtml(markdown.toHTML(vm.currentNews.text));
            // Hide editing controls
            vm.currentNews.modify = false;
            delete vm.currentNews.oldSlug;
            vm.toastr.success("News successfully updated!");
        }, function (err) {
            if (err.status === 401) {
                vm.toastr.error("You don't have access to perform this action");
            } else {
                vm.toastr.error(err.data.message);
            }
        });
    };

    /**
     * Deleting for current news handler
     */
    NewsCtrl.prototype.deleteCurrentNews = function () {
        var vm = this;

        // Request server to delete this entry by it's slug
        vm.ResourceService.deleteNews(vm.currentNews.slug).then(function () {
            // Done - redirect to main page
            vm.$location.path("/index");
            vm.toastr.success("News successfully deleted!");
        }, function (err) {
            if (err.status === 401) {
                vm.toastr.error("You don't have access to perform this action");
            } else {
                vm.toastr.error(err.data.message);
            }
        });
    };

    /**
     * Controller for creating new news
     */
    function NewsCreateCtrl($location, ResourceService, toastr) {
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.toastr = toastr;

        vm.newNews = {};
    }

    /**
     * Button pressed
     */
    NewsCreateCtrl.prototype.createNews = function () {
        var vm = this;

        // Generate slug from subject
        vm.newNews.slug = vm.newNews.subject.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');

        // Request server to save this news
        vm.ResourceService.createNews(vm.newNews).then(function (news) {
            // Done - redirect to this entry
            vm.$location.path("/news/" + news.slug);
            vm.toastr.success("News successfully created!");
        }, function (err) {
            if (err.status === 401) {
                vm.toastr.error("You don't have access to perform this action");
            } else {
                vm.toastr.error(err.data.message);
            }
        });
    };

    return clhNewsControllers;
});