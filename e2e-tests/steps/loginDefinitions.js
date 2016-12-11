var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

featureSteps('Login')
    .when('I log out', function () {
        var username = element(by.binding('vm.currentUser.name'));
        username.click();
        var logout = element(by.linkText('Logout'));
        logout.click();
        browser.waitForAngular();
    })
    .then('I am not logged in', function () {
        var username = element(by.binding('vm.currentUser.name'));
        expect(username.isDisplayed()).toBeFalsy();
        var login = element(by.linkText('Login'));
        expect(login.isDisplayed()).toBeTruthy();
    });