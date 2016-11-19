define(['angular'], function (angular) {
    'use strict';

    /* Controllers */

    var clhUsersControllers = angular.module('clhUsersControllers', []);

    clhUsersControllers.controller('UserListCtrl', ['ResourceService', 'data', 'toastr', UserListCtrl]);
    clhUsersControllers.controller('UserCreateCtrl', ['$location', 'ResourceService', 'AuthenticationService', 'toastr', UserCreateCtrl]);
    clhUsersControllers.controller('UserDetailsCtrl', ['ResourceService', 'AuthenticationService', 'data', 'toastr', UserDetailsCtrl]);

    /**
     * Controller for the user list
     */
    function UserListCtrl(ResourceService, data, toastr) {
        var vm = this;
        vm.ResourceService = ResourceService;
        vm.toastr = toastr;

        vm.users = data[0];
    }

    /**
     * Update users button
     */
    UserListCtrl.prototype.updateUser = function (index, modify) {
        var vm = this;
        var user = vm.users[index];

        if (modify) {
            vm.users[index].modify = true;
        } else {
            vm.ResourceService.updateUser(user.username, user).then(function (user) {
                vm.users[index] = user;
                vm.users[index].modify = false;
                vm.toastr.success("User successfully updated!");
            }, function (err) {
                if (err.status === 401) {
                    vm.toastr.error("You don't have access to perform this action");
                } else {
                    vm.toastr.error(err.data.message);
                }
            });
        }
    };

    /**
     * Delete users button
     */
    UserListCtrl.prototype.deleteUser = function (index) {
        var vm = this;
        var user = vm.users[index];

        vm.ResourceService.deleteUser(user.username).then(function () {
            vm.users.splice(index, 1);
            vm.toastr.success("User successfully deleted!");
        }, function (err) {
            if (err.status === 401) {
                vm.toastr.error("You don't have access to perform this action");
            } else {
                vm.toastr.error(err.data.message);
            }
        });
    };

    /**
     * Create user controller
     */
    function UserCreateCtrl($location, ResourceService, AuthenticationService, toastr) {
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.AuthenticationService = AuthenticationService;
        vm.toastr = toastr;
    }

    /**
     * Create user button
     */
    UserCreateCtrl.prototype.createUser = function () {
        var vm = this;

        var user = vm.userDetails;
        var plainTextPassword = user.plainTextPassword;
        vm.AuthenticationService.encryptUserPassword(user);

        vm.ResourceService.createUser(user).then(function () {
            vm.$location.path("/users");
            vm.toastr.success("User successfully created!");
        }, function (err) {
            user.plainTextPassword = plainTextPassword;
            if (err.status === 401) {
                vm.toastr.error("You don't have access to perform this action");
            } else {
                vm.toastr.error(err.data.message);
            }
        });
    };

    function UserDetailsCtrl(ResourceService, AuthenticationService, data, toastr) {
        var vm = this;
        vm.ResourceService = ResourceService;
        vm.AuthenticationService = AuthenticationService;
        vm.toastr = toastr;

        vm.userDetails = data[0];
        // Save known password hash as a plain text password
        // This will let us later know do we need to update it
        vm.userDetails.plainTextPassword = vm.userDetails.password;
    }

    /**
     * Update user button
     */
    UserDetailsCtrl.prototype.updateUser = function () {
        var vm = this;

        var user = vm.userDetails;
        var plainTextPassword = user.plainTextPassword;
        vm.AuthenticationService.encryptUserPassword(user);

        vm.ResourceService.updateUser(user.username, user).then(function (user) {
            vm.userDetails = user;
            vm.userDetails.plainTextPassword = user.password;
            vm.toastr.success("User successfully updated!");
        }, function (err) {
            // As we lost this field before sending to server - create it again
            user.plainTextPassword = plainTextPassword;
            if (err.status === 401) {
                vm.toastr.error("You don't have access to perform this action");
            } else {
                vm.toastr.error(err.data.message);
            }
        });
    };

    return clhUsersControllers;
});