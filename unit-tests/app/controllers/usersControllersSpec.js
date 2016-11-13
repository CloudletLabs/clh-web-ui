define(['angularMock', 'app', 'spechelper'], function(angular) {

    describe('clhUsersControllers', function() {
        var $location;
        var $controller;

        var user = {
            "username": "user",
            "password": "720bb2073cb1961d26404ba1f5fe3f4d83b183bf72b8f7328c51f132b3c362db",
            "email": "user@example.com",
            "name": "User",
            "avatar": "img\/mockUser2.jpg",
            "roles": [
                "5766c15dfa6c831a5d3aca44"
            ],
            "token": {
                "auth_token": "ea647660-3643-11e6-8c9d-af76620da978",
                "createDate": "2016-06-19T17:33:20.454Z"
            }
        };
        var updatedUser = {
            "username": "user1",
            "password": "1",
            "email": "user1@example.com",
            "name": "User1",
            "avatar": "img\/mockUser21.jpg",
            "roles": [
                "5766c15dfa6c831a5d3aca44"
            ],
            "token": {
                "auth_token": "ea647660-3643-11e6-8c9d-af76620da978",
                "createDate": "2016-06-19T17:33:20.454Z"
            }
        };

        beforeEach(function () {
            module('clhApp');

            inject(function(_$location_, _$controller_) {
                $controller = _$controller_;
                $location = _$location_;
            });
        });

        describe('UserListCtrl', function() {
            var vm;

            beforeEach(function() {
                vm = $controller('UserListCtrl', { data: [[ user ]] });
            });

            it('default', function() {
                expect(vm).toBeDefined();
                expect(vm.ResourceService).toBeDefined();
                expect(vm.toastr).toBeDefined();
                expect(vm.users.length).toBe(1);
                expect(vm.users[0]).toBe(user);
            });

            it('current start modify', function() {
                vm.updateUser(0, true);
                expect(vm.users[0].modify).toBe(true);
            });

            it('current finish modify', function() {
                spyOn(vm.ResourceService, 'updateUser').and.callFake(mockPromise(updatedUser));
                spyOn(vm.toastr, 'success');
                vm.updateUser(0, true);
                vm.updateUser(0, false);
                expect(vm.ResourceService.updateUser).toHaveBeenCalled();
                expect(vm.users[0].modify).toBe(false);
                expect(vm.users[0]).toBe(updatedUser);
                expect(vm.toastr.success).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('current modify permissions missing', function() {
                spyOn(vm.ResourceService, 'updateUser').and.callFake(mockPromise({status: 401}, true));
                spyOn(vm.toastr, 'error');
                vm.updateUser(0, true);
                vm.updateUser(0, false);
                expect(vm.ResourceService.updateUser).toHaveBeenCalled();
                expect(vm.users[0].modify).toBe(true);
                expect(vm.users[0]).toBe(user);
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('current modify server error', function() {
                spyOn(vm.ResourceService, 'updateUser').and.callFake(mockPromise({data:{message:'123'}}, true));
                spyOn(vm.toastr, 'error');
                vm.updateUser(0, true);
                vm.updateUser(0, false);
                expect(vm.ResourceService.updateUser).toHaveBeenCalled();
                expect(vm.users[0].modify).toBe(true);
                expect(vm.users[0]).toBe(user);
                expect(vm.toastr.error).toHaveBeenCalledWith('123');
            });

            it('current delete', function() {
                spyOn(vm.ResourceService, 'deleteUser').and.callFake(mockPromise({}));
                spyOn(vm.toastr, 'success');
                vm.deleteUser(0);
                expect(vm.ResourceService.deleteUser).toHaveBeenCalled();
                expect(vm.users.length).toBe(0);
                expect(vm.toastr.success).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('current delete permissions missing', function() {
                spyOn(vm.ResourceService, 'deleteUser').and.callFake(mockPromise({status: 401}, true));
                spyOn(vm.toastr, 'error');
                vm.deleteUser(0);
                expect(vm.ResourceService.deleteUser).toHaveBeenCalled();
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('current delete server error', function() {
                spyOn(vm.ResourceService, 'deleteUser').and.callFake(mockPromise({data: {message: '123'}}, true));
                spyOn(vm.toastr, 'error');
                vm.deleteUser(0);
                expect(vm.ResourceService.deleteUser).toHaveBeenCalled();
                expect(vm.toastr.error).toHaveBeenCalledWith('123');
            });

        });

        describe('UserCreateCtrl', function() {
            var vm;

            beforeEach(function() {
                vm = $controller('UserCreateCtrl', { });
            });

            it('default', function() {
                expect(vm).toBeDefined();
                expect(vm.$location).toBeDefined();
                expect(vm.ResourceService).toBeDefined();
                expect(vm.AuthenticationService).toBeDefined();
                expect(vm.toastr).toBeDefined();
            });

            it('create', function() {
                vm.userDetails = user;
                vm.userDetails.plainTextPassword = 'user';
                spyOn(vm.AuthenticationService, 'encryptUserPassword').and.callThrough();
                spyOn(vm.ResourceService, 'createUser').and.callFake(mockPromise(user));
                spyOn(vm.toastr, 'success');
                vm.createUser();
                expect(vm.AuthenticationService.encryptUserPassword).toHaveBeenCalledWith(user);
                expect(vm.ResourceService.createUser).toHaveBeenCalledWith(user);
                expect($location.path()).toBe('/users');
                expect(vm.toastr.success).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('createNews permissions missing', function() {
                vm.userDetails = user;
                vm.userDetails.plainTextPassword = 'user';
                spyOn(vm.AuthenticationService, 'encryptUserPassword').and.callThrough();
                spyOn(vm.ResourceService, 'createUser').and.callFake(mockPromise({status: 401}, true));
                spyOn(vm.toastr, 'error');
                vm.createUser();
                expect(vm.AuthenticationService.encryptUserPassword).toHaveBeenCalledWith(user);
                expect(vm.ResourceService.createUser).toHaveBeenCalledWith(user);
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('createNews server error', function() {
                vm.userDetails = user;
                vm.userDetails.plainTextPassword = 'user';
                spyOn(vm.AuthenticationService, 'encryptUserPassword').and.callThrough();
                spyOn(vm.ResourceService, 'createUser').and.callFake(mockPromise({data: {message: '123'}}, true));
                spyOn(vm.toastr, 'error');
                vm.createUser();
                expect(vm.AuthenticationService.encryptUserPassword).toHaveBeenCalledWith(user);
                expect(vm.ResourceService.createUser).toHaveBeenCalledWith(user);
                expect(vm.toastr.error).toHaveBeenCalledWith('123');
            });

        });

        describe('UserDetailsCtrl', function() {
            var vm;

            beforeEach(function() {
                vm = $controller('UserDetailsCtrl', { data: [ user ] });
            });

            it('default', function() {
                expect(vm).toBeDefined();
                expect(vm.ResourceService).toBeDefined();
                expect(vm.AuthenticationService).toBeDefined();
                expect(vm.toastr).toBeDefined();
                expect(vm.userDetails).toBeDefined();
                expect(vm.userDetails.plainTextPassword).toBeDefined(vm.userDetails.password);
            });

            it('update', function() {
                vm.userDetails = updatedUser;
                vm.userDetails.plainTextPassword = 'user1';
                spyOn(vm.AuthenticationService, 'encryptUserPassword').and.callThrough();
                spyOn(vm.ResourceService, 'updateUser').and.callFake(mockPromise(updatedUser));
                spyOn(vm.toastr, 'success');
                vm.updateUser();
                expect(vm.AuthenticationService.encryptUserPassword).toHaveBeenCalledWith(updatedUser);
                expect(vm.ResourceService.updateUser).toHaveBeenCalledWith(updatedUser);
                expect(vm.userDetails.plainTextPassword).toBeDefined(vm.userDetails.password);
                expect(vm.toastr.success).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('update permissions missing', function() {
                vm.userDetails = updatedUser;
                vm.userDetails.plainTextPassword = 'user1';
                spyOn(vm.AuthenticationService, 'encryptUserPassword').and.callThrough();
                spyOn(vm.ResourceService, 'updateUser').and.callFake(mockPromise({status: 401}, true));
                spyOn(vm.toastr, 'error');
                vm.updateUser();
                expect(vm.AuthenticationService.encryptUserPassword).toHaveBeenCalledWith(updatedUser);
                expect(vm.ResourceService.updateUser).toHaveBeenCalledWith(updatedUser);
                expect(vm.toastr.error).toHaveBeenCalledWith(jasmine.any(String));
            });

            it('update server error', function() {
                vm.userDetails = updatedUser;
                vm.userDetails.plainTextPassword = 'user1';
                spyOn(vm.AuthenticationService, 'encryptUserPassword').and.callThrough();
                spyOn(vm.ResourceService, 'updateUser').and.callFake(mockPromise({data: {message: '123'}}, true));
                spyOn(vm.toastr, 'error');
                vm.updateUser();
                expect(vm.AuthenticationService.encryptUserPassword).toHaveBeenCalledWith(updatedUser);
                expect(vm.ResourceService.updateUser).toHaveBeenCalledWith(updatedUser);
                expect(vm.toastr.error).toHaveBeenCalledWith('123');
            });

        });
    });

});