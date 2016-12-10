var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

afterEach(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
});

featureSteps()
    .given('I go to "(.*)"', function (site) {
        browser.get(browser.baseUrl + site);
    })
    .given('I should be logged in as "(.*)"/"(.*)"', function (username, password) {
        this.given('I go to "#/login"');
        this.when("I enter \"username\" = \"${username}\"");
        this.when("I enter \"password\" = \"${password}\"");
        this.when('I click the "login_submit_button" button');
    })
    .when('I enter "(.*)" = "(.*)"', function (fieldModel, value) {
        element(by.model('vm.' + fieldModel)).sendKeys(value);
    })
    .when('I click the "(.*)" button', function (buttonId) {
        element(by.id(buttonId)).click();
    })
    .then('I should be on "(.*)"', function (url) {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + url);
    })
    .then('I should be logged in as "(.*)"', function (userDisplayName) {
        var username = element(by.id('username_dropdown_toggler'));
        expect(username.getText()).toEqual(userDisplayName);
    })
    .then('I should get an error "(.*)"', function (message) {
        var error = element(by.css('[class="toast-message"]'));
        expect(error.getText()).toEqual(message);
    });