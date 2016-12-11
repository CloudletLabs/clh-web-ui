var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

var username = 'test_admin_user_' + onPrepareTimestamp;

var findUserInList = function(name) {
    var deferred = protractor.promise.defer();
    element.all(by.repeater('user in vm.users')).then(function (users) {
        // deferred.fulfill(users[users.length - 1]);
        users.forEach(function (user, index) {
            user.element(by.binding('user.name')).getText().then(function (text) {
                if (text == name) {
                    deferred.fulfill(user);
                } else if(users.length - 1 == index) {
                    deferred.reject(name);
                }
            });
        });
    });
    return deferred.promise;
};

var validateCurrentUser = function(currentUser, username, name, email, avatar) {
    expect(currentUser.element(by.binding('user.name')).getText()).toEqual(name);
    expect(currentUser.element(by.binding('user.email')).getText()).toEqual(email);
    var a = currentUser.element(by.css('a.thumb'));
    expect(a.getAttribute('href')).toEqual(browser.baseUrl + '#/users/' + username);
    expect(a.element(by.tagName('img')).getAttribute('src')).toEqual(browser.baseUrl + avatar);
};

var findAndValidateCurrentUser = function(username, name, email, avatar) {
    findUserInList(name).then(function (currentUser) {
        validateCurrentUser(currentUser, username, name, email, avatar);
    }, function (name) {
        expect(null).toEqual(name);
    });
};

featureSteps('Users: Admin')
    .when('I create test user', function () {
        this.given('I go to "#/user"');
        element(by.model('vm.userDetails.username')).clear().sendKeys(username);
        element(by.model('vm.userDetails.name')).clear().sendKeys('D_' + username);
        element(by.model('vm.userDetails.email')).clear().sendKeys(username + '@example.com');
        element(by.model('vm.userDetails.plainTextPassword')).clear().sendKeys(username);
        this.when('I click the button "Done"');
    })
    .when('I update test user from list screen', function () {
        this.given('I go to "#/users"');
        findUserInList('D_' + username).then(function (currentUser) {
            currentUser.element(by.buttonText('Modify')).click();
            browser.waitForAngular();
            currentUser.element(by.model('user.name')).clear().sendKeys('Admin_' + username);
            currentUser.element(by.model('user.email')).clear().sendKeys(username + '-2@example.com');
            currentUser.element(by.model('user.avatar')).clear().sendKeys('img/mockUser.jpg');
            currentUser.element(by.buttonText('Update')).click();
            browser.waitForAngular();
        }, function (name) {
            expect(null).toEqual(name);
        });
    })
    .when('I update test user from user screen', function () {
        this.given('I go to "#/users/' + username + '"');
        element(by.model('vm.userDetails.name')).clear().sendKeys('Admin2_' + username);
        element(by.model('vm.userDetails.email')).clear().sendKeys(username + '-3@example.com');
        element(by.model('vm.userDetails.avatar')).clear().sendKeys('favicon.ico');
        element(by.model('vm.userDetails.plainTextPassword')).clear().sendKeys('qwe');
        this.when('I click the button "Done"');
    })
    .when('I update test user from user screen excluding password', function () {
        this.given('I go to "#/users/' + username + '"');
        element(by.model('vm.userDetails.name')).clear().sendKeys('Admin3_' + username);
        this.when('I click the button "Done"');
    })
    .when('I delete test user', function () {
        findUserInList('Admin3_' + username).then(function (currentUser) {
            currentUser.element(by.buttonText('Delete')).click();
            browser.waitForAngular();
        }, function (name) {
            expect(null).toEqual(name);
        });
    })
    .then('I should see a user list', function () {
        element.all(by.repeater('user in vm.users')).then(function (users) {
            expect(users.length).not.toBeLessThan(2);
            validateCurrentUser(users[0], 'admin', 'Admin', 'admin@example.com', 'img/mockUser.jpg');
            validateCurrentUser(users[1], 'user', 'User', 'user@example.com', 'img/mockUser2.jpg');
        });
    })
    .then('I should see the new test user', function () {
        findAndValidateCurrentUser(username, 'D_' + username, username + '@example.com', 'img/mockUser2.jpg');
    })
    .then('I should see updated test user v2', function () {
        findAndValidateCurrentUser(username, 'Admin_' + username, username + '-2@example.com', 'img/mockUser.jpg');
    })
    .then('I should see updated test user v3', function () {
        this.given('I go to "#/users"');
        findAndValidateCurrentUser(username, 'Admin2_' + username, username + '-3@example.com', 'favicon.ico');
    })
    .then('I should see updated test user v4', function () {
        this.given('I go to "#/users"');
        findAndValidateCurrentUser(username, 'Admin3_' + username, username + '-3@example.com', 'favicon.ico');
    })
    .then('I should not see test user', function () {
        findUserInList('Admin3_' + username).then(function (currentUser) {
            expect(currentUser).toBeNull();
        }, function (name) {
            expect(name).toEqual('Admin3_' + username);
        });
    })
    .then('I should be able to login with test user v1', function () {
        this.given('I logged in as "' + username + '"/"' + username + '"');
        this.then('I should be logged in as "D_' + username + '"');
    })
    .then('I should be able to login with test user v3', function () {
        this.given('I logged in as "' + username + '"/"qwe"');
        this.then('I should be logged in as "Admin2_' + username + '"');
    })
    .then('I should be able to login with test user v4', function () {
        this.given('I logged in as "' + username + '"/"qwe"');
        this.then('I should be logged in as "Admin3_' + username + '"');
    })
    .then('I should not be able to login with test user', function () {
        this.given('I logged in as "' + username + '"/"qwe"');
        this.then('I should get an error "Wrong username and/or password!"')
    });