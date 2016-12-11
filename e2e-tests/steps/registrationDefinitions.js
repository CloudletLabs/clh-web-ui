var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

featureSteps('Registration')
    .when('I fill in new test user', function () {
        var user = 'test_user_' + onPrepareTimestamp;
        element(by.model('vm.username')).clear().sendKeys(user);
        element(by.model('vm.name')).clear().sendKeys('D_' + user);
        element(by.model('vm.email')).clear().sendKeys(user + '@example.com');
        element(by.model('vm.password')).clear().sendKeys(user);
        element(by.model('vm.check_password')).clear().sendKeys(user);
    })
    .when('I fill in new test user with wrong password check', function () {
        this.when('I fill in new test user');
        element(by.model('vm.check_password')).clear().sendKeys('qwe');
    })
    .when('I fill in new test user with wrong email', function () {
        this.when('I fill in new test user');
        element(by.model('vm.email')).clear().sendKeys('qwe');
    })
    .then('I should be logged in as new test user', function () {
        var username = element(by.id('username_dropdown_toggler'));
        expect(username.getText()).toEqual('D_test_user_' + onPrepareTimestamp);
    })
    .then('I should see email validator error', function () {
        var email = element(by.model('vm.email'));
        expect(email.getAttribute('class')).toContain('ng-invalid');
        expect(email.getAttribute('class')).toContain('ng-invalid-email');
    });