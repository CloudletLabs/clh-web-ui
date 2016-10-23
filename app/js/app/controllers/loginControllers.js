define(['angular'], function (angular) {
    'use strict';

    /* Controllers */

    var clhLoginControllers = angular.module('clhLoginControllers', []);

    clhLoginControllers.controller('LoginCtrl', ['AuthenticationService', 'toastr', LoginCtrl]);
    clhLoginControllers.controller('RegistrationCtrl', ['AuthenticationService', 'toastr', RegistrationCtrl]);

    /**
     * Controller for login form
     */
    function LoginCtrl(AuthenticationService, toastr) {
        var vm = this;
        vm.AuthenticationService = AuthenticationService;
        vm.toastr = toastr;
    }

    /**
     * When Login button pressed
     */
    LoginCtrl.prototype.submit = function () {
        var vm = this;

        if (vm.username && vm.password) {
            vm.AuthenticationService.doLogin(vm.username, vm.password);
        } else {
            vm.toastr.error('Username and password are mandatory!');
        }
    };

    /**
     * Controller for registration form
     */
    function RegistrationCtrl(AuthenticationService, toastr) {
        var vm = this;
        vm.AuthenticationService = AuthenticationService;
        vm.toastr = toastr;
    }

    /**
     * When button pressed
     */
    RegistrationCtrl.prototype.register = function () {
        var vm = this;

        // Some validation
        if (vm.username && vm.name && vm.email && vm.password && vm.check_password) {
            if (vm.password !== vm.check_password) {
                vm.toastr.error('Password must be the same in both fields!');
            } else {
                vm.AuthenticationService.doRegister(vm.username, vm.name, vm.email, vm.password, vm.AuthenticationService.doLogin);
            }
        } else {
            vm.toastr.error('Please fill required fields!');
        }
    };

    return clhLoginControllers;
});