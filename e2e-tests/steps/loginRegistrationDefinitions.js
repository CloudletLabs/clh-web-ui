var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

var timestamp = new Date().getTime();

featureSteps('Login/Registration')
    .when('I fill in new test user', function () {
        var user = 'test_user_' + timestamp;
        element(by.model('vm.username')).sendKeys(user);
        element(by.model('vm.name')).sendKeys('D_' + user);
        element(by.model('vm.email')).sendKeys(user + '@example.com');
        element(by.model('vm.password')).sendKeys(user);
        element(by.model('vm.check_password')).sendKeys(user);
    })
    .when('I fill in new test user with wrong password check', function () {
        this.when('I fill in new test user');
        element(by.model('vm.check_password')).sendKeys('qwe');
    })
    .then('I should be logged in as "(.*)"', function (userDisplayName) {
        var username = element(by.id('username_dropdown_toggler'));
        expect(username.getText()).toEqual(userDisplayName);
    })
    .then('I should be logged in as new test user', function () {
        var username = element(by.id('username_dropdown_toggler'));
        expect(username.getText()).toEqual('D_test_user_' + timestamp);
    })
    .then('I should get an error "(.*)"', function (message) {
        var error = element(by.css('[class="toast-message"]'));
        expect(error.getText()).toEqual(message);
    });