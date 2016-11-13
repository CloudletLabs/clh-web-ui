define(['angularMock', 'app'], function(angular) {

    describe('clhLoginControllers', function() {
        var $controller;

        beforeEach(module('clhApp'));
        beforeEach(inject(function(_$controller_){
            $controller = _$controller_;
        }));

        describe('LoginCtrl', function() {
            var vm;

            beforeEach(function() {
                vm = $controller('LoginCtrl', { });
            });

            it('default', function() {
                expect(vm).toBeDefined();
                expect(vm.AuthenticationService).toBeDefined();
                expect(vm.toastr).toBeDefined();
            });

            it('submit empty', function() {
                spyOn(vm.toastr, 'error');
                vm.submit();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('submit empty username', function() {
                spyOn(vm.toastr, 'error');
                vm.password = 'test';
                vm.submit();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('submit empty password', function() {
                spyOn(vm.toastr, 'error');
                vm.username = 'test';
                vm.submit();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('submit', function() {
                spyOn(vm.toastr, 'error');
                spyOn(vm.AuthenticationService, 'doLogin').and.callThrough();
                vm.username = 'test';
                vm.password = 'test';
                vm.submit();
                expect(vm.toastr.error).not.toHaveBeenCalled();
                expect(vm.AuthenticationService.doLogin).toHaveBeenCalledWith('test', 'test');
            });

        });

        describe('RegistrationCtrl', function() {
            var vm;

            beforeEach(function() {
                vm = $controller('RegistrationCtrl', { });
            });

            it('default', function() {
                expect(vm).toBeDefined();
                expect(vm.AuthenticationService).toBeDefined();
                expect(vm.toastr).toBeDefined();
            });

            it('register empty', function() {
                spyOn(vm.toastr, 'error');
                vm.register();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('register empty username', function() {
                spyOn(vm.toastr, 'error');
                spyOn(vm.AuthenticationService, 'doRegister').and.callThrough();
                spyOn(vm.AuthenticationService, 'doLogin').and.callThrough();
                vm.password = 'test';
                vm.check_password = 'test';
                vm.name = 'test';
                vm.email = 'test';
                vm.register();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('register empty password', function() {
                spyOn(vm.toastr, 'error');
                spyOn(vm.AuthenticationService, 'doRegister').and.callThrough();
                spyOn(vm.AuthenticationService, 'doLogin').and.callThrough();
                vm.username = 'test';
                vm.check_password = 'test';
                vm.name = 'test';
                vm.email = 'test';
                vm.register();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('register empty check_password', function() {
                spyOn(vm.toastr, 'error');
                spyOn(vm.AuthenticationService, 'doRegister').and.callThrough();
                spyOn(vm.AuthenticationService, 'doLogin').and.callThrough();
                vm.username = 'test';
                vm.password = 'test';
                vm.name = 'test';
                vm.email = 'test';
                vm.register();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('register empty name', function() {
                spyOn(vm.toastr, 'error');
                spyOn(vm.AuthenticationService, 'doRegister').and.callThrough();
                spyOn(vm.AuthenticationService, 'doLogin').and.callThrough();
                vm.username = 'test';
                vm.password = 'test';
                vm.check_password = 'test';
                vm.email = 'test';
                vm.register();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('register empty email', function() {
                spyOn(vm.toastr, 'error');
                spyOn(vm.AuthenticationService, 'doRegister').and.callThrough();
                spyOn(vm.AuthenticationService, 'doLogin').and.callThrough();
                vm.username = 'test';
                vm.password = 'test';
                vm.check_password = 'test';
                vm.name = 'test';
                vm.register();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('register password and check_password do not match', function() {
                spyOn(vm.toastr, 'error');
                spyOn(vm.AuthenticationService, 'doRegister').and.callThrough();
                spyOn(vm.AuthenticationService, 'doLogin').and.callThrough();
                vm.username = 'test';
                vm.password = 'test';
                vm.check_password = 'test1';
                vm.name = 'test';
                vm.email = 'test';
                vm.register();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('register', function() {
                spyOn(vm.toastr, 'error');
                spyOn(vm.AuthenticationService, 'doRegister').and.callThrough();
                spyOn(vm.AuthenticationService, 'doLogin').and.callThrough();
                vm.username = 'test';
                vm.password = 'test';
                vm.check_password = 'test';
                vm.name = 'test';
                vm.email = 'test';
                vm.register();
                expect(vm.toastr.error).not.toHaveBeenCalled();
                expect(vm.AuthenticationService.doRegister).toHaveBeenCalledWith('test', 'test', 'test', 'test',
                    jasmine.any(Function));
            });

        });
    });

});