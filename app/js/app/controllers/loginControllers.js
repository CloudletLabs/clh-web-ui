define(['angular'], function (angular) {
    'use strict';

    /* Controllers */

    var clhLoginControllers = angular.module('clhLoginControllers', []);

    clhLoginControllers.controller('LoginCtrl', ['$location', 'ResourceService', 'CryptoJSService', 'localStorageService', 'toastr', LoginCtrl]);
    clhLoginControllers.controller('RegistrationCtrl', ['$location', 'ResourceService', 'CryptoJSService', 'localStorageService', 'toastr', RegistrationCtrl]);

    /**
     * Controller for login form
     */
    function LoginCtrl($location, ResourceService, CryptoJS, localStorageService, toastr) {
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.CryptoJS = CryptoJS;
        vm.localStorageService = localStorageService;
        vm.toastr = toastr;
    }

    /**
     * When Login button pressed
     */
    LoginCtrl.prototype.submit = function () {
        var vm = this;

        if (vm.username !== undefined || vm.password !== undefined) {
            // Calculate hash function for password
            var salt = vm.username;
            var enc_password = CryptoJS.PBKDF2(vm.password, salt, {keySize: 256 / 32});
            var user = {"username": vm.username, "password": enc_password.toString()};

            doLogin(vm, user);
        } else {
            vm.toastr.error('Username and password are mandatory!');
        }
    };

    /**
     * Execute login for this user
     */
    function doLogin(vm, user) {
        // Get a token
        vm.ResourceService.login(user).then(function (data) {
            // Got a token - save to local storage
            vm.localStorageService.set("auth_token", data.auth_token);
            // Get a user for this token
            vm.ResourceService.getCurrentUser().then(function (data) {
                // Got a user - save to local storage as well
                vm.localStorageService.set("user", data);
                // TODO: redirect to a resource being requested originally
                vm.$location.path("/index");
            }, function (err) {
                // Error getting a user for this token - probably expired?
                vm.localStorageService.clearAll();
                vm.$location.path("/login");
                vm.toastr.error(err.data.message);
            });
        }, function (err) {
            // Error getting a token
            if (err.status === 401) {
                vm.toastr.error('Wrong username and/or password!');
            } else {
                vm.toastr.error(err.data.message);
            }
        });
    }

    /**
     * Controller for registration form
     */
    function RegistrationCtrl($location, ResourceService, CryptoJS, localStorageService, toastr) {
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.CryptoJS = CryptoJS;
        vm.localStorageService = localStorageService;
        vm.toastr = toastr;
    }

    /**
     * When button pressed
     */
    RegistrationCtrl.prototype.register = function () {
        var vm = this;

        // Calculate hash function for password
        var salt = vm.username;
        var enc_password = CryptoJS.PBKDF2(vm.password, salt, {keySize: 256 / 32});
        var user = {
            "username": vm.username,
            "name": vm.name,
            "email": vm.email,
            "password": enc_password.toString()
        };

        // Some validation
        if (vm.username !== undefined ||
            vm.name !== undefined ||
            vm.email !== undefined ||
            vm.password !== undefined ||
            vm.check_password !== undefined) {
            if (vm.password !== vm.check_password) {
                vm.toastr.error('Password must be the same in both fields!');
            } else {
                // Request to create a user
                vm.ResourceService.register(user).then(function () {
                    vm.toastr.success('User successfully registered!');
                    doLogin(vm, user);
                }, function (err) {
                    vm.toastr.error(err.data.message);
                });
            }
        } else {
            vm.toastr.error('Please fill required fields!');
        }
    };

    return clhLoginControllers;
});