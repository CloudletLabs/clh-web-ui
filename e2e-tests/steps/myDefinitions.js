var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

featureSteps('Login')
    .given('I go to "(.*)"', function (site) {
        browser.get(browser.baseUrl + site);
    })
    .when('I enter username "(.*)" and password "(.*)"', function (username, password) {
        element(by.model('vm.username')).sendKeys(username);
        element(by.model('vm.password')).sendKeys(password);
    })
    .when('I click the Login button', function () {
        element(by.id('login_submit_button')).click();
    })
    .then('I should be logged in', function () {
        var username = element(by.id('username_dropdown_toggler'));
        expect(username.getText()).toEqual('Admin');
    });