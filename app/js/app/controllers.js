define(['angular'], function (angular) {
    'use strict';

    /* Controllers */

    var bdnControllers = angular.module('bdnControllers', []);

    bdnControllers.controller('NavCtrl', ['$location', 'localStorageService', 'AuthenticationService', NavCtrl]);
    bdnControllers.controller('LoginCtrl', ['$location', 'ResourceService', 'CryptoJSService', 'localStorageService', 'toastr', LoginCtrl]);
    bdnControllers.controller('RegistrationCtrl', ['$location', 'ResourceService', 'CryptoJSService', 'localStorageService', 'toastr', RegistrationCtrl]);
    bdnControllers.controller('IndexCtrl', ['$sce', 'ResourceService', 'data', 'toastr', IndexCtrl]);
    bdnControllers.controller('NewsCtrl', ['$location', '$sce', 'AuthenticationService', 'ResourceService', 'data', 'toastr', NewsCtrl]);
    bdnControllers.controller('NewsCreateCtrl', ['$location', 'ResourceService', 'toastr', NewsCreateCtrl]);
    bdnControllers.controller('UserListCtrl', ['ResourceService', 'data', 'toastr', UserListCtrl]);
    bdnControllers.controller('UserCreateCtrl', ['$location', 'ResourceService', 'CryptoJSService', 'toastr', UserCreateCtrl]);
    bdnControllers.controller('UserDetailsCtrl', ['ResourceService', 'CryptoJSService', 'data', 'toastr', UserDetailsCtrl]);

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
            "password": enc_password.toString(),
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

    /**
     * Controller for an index page
     */
    function IndexCtrl($sce, ResourceService, data, toastr) {
        var vm = this;
        vm.ResourceService = ResourceService;
        vm.toastr = toastr;

        vm.news = data[0];
        // Render markdown to html
        vm.news.forEach(function (news) {
            news.html = $sce.trustAsHtml(markdown.toHTML(news.text));
        });
    }

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
     * Update current news handler
     */
    NewsCtrl.prototype.updateCurrentNews = function (modify) {
        var vm = this;

        if (modify) {
            // When pressed initially - just change the status to render another controls
            vm.currentNews.modify = true;
        } else {
            // When done editing - request to the server
            vm.ResourceService.updateNews(vm.currentNews).then(function (news) {
                // Updated, save new instance and render it
                vm.currentNews = news;
                vm.currentNews.html = vm.$sce.trustAsHtml(markdown.toHTML(vm.currentNews.text));
                // Hide editing controls
                vm.currentNews.modify = false;
                vm.toastr.success("News successfully updated!");
            }, function (err) {
                if (err.status === 401) {
                    vm.toastr.error("You don't have access to perform this action");
                } else {
                    vm.toastr.error(err.data.message);
                }
            });
        }
    }

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
    }

    /**
     * Controller for creating new news
     */
    function NewsCreateCtrl($location, ResourceService, toastr) {
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.toastr = toastr;
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
    }

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
            vm.ResourceService.updateUser(user).then(function (user) {
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
    function UserCreateCtrl($location, ResourceService, CryptoJS, toastr) {
        var vm = this;
        vm.$location = $location;
        vm.ResourceService = ResourceService;
        vm.CryptoJS = CryptoJS;
        vm.toastr = toastr;
    }

    /**
     * Create user button
     */
    UserCreateCtrl.prototype.createUser = function () {
        var vm = this;

        var user = vm.userDetails;
        encryptUserPassword(user, CryptoJS);

        vm.ResourceService.createUser(user).then(function () {
            vm.$location.path("/users");
            vm.toastr.success("User successfully created!");
        }, function (err) {
            user.plainTextPassword = user.password;
            if (err.status === 401) {
                vm.toastr.error("You don't have access to perform this action");
            } else {
                vm.toastr.error(err.data.message);
            }
        });
    };

    function UserDetailsCtrl(ResourceService, CryptoJS, data, toastr) {
        var vm = this;
        vm.ResourceService = ResourceService;
        vm.CryptoJS = CryptoJS;
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
        encryptUserPassword(user, CryptoJS);

        vm.ResourceService.updateUser(user).then(function (user) {
            vm.userDetails = user;
            vm.userDetails.plainTextPassword = user.password;
            vm.toastr.success("User successfully updated!");
        }, function (err) {
            // As we lost this field before sending to server - create it again
            vm.userDetails.plainTextPassword = user.password;
            if (err.status === 401) {
                vm.toastr.error("You don't have access to perform this action");
            } else {
                vm.toastr.error(err.data.message);
            }
        });
    };

    /**
     * Read user password from plainTextPassword and save it as a hash
     * Delete plainTextPassword once done
     * Do nothing if plainTextPassword has newer been changed
     */
    function encryptUserPassword(user, CryptoJS) {
        if (user.plainTextPassword !== user.password) {
            user.password = CryptoJS.PBKDF2(user.plainTextPassword, user.username, {keySize: 256 / 32}).toString();
        }
        delete user.plainTextPassword;
    }

    return bdnControllers;
});