var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

afterEach(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
});

featureSteps()
    .given('I go to "(.*)"', function (site) {
        browser.get(browser.baseUrl + site);
    })
    .when('I enter "(.*)" = "(.*)"', function (fieldModel, value) {
        element(by.model('vm.' + fieldModel)).sendKeys(value);
    })
    .when('I click the "(.*)" button', function (buttonId) {
        element(by.id(buttonId)).click();
    })
    .given('I should be logged in as "(.*)"/"(.*)"', function (username, password) {
        step('I go to "#/login"');
        step("I enter \"username\" = \"${username}\"");
        step("I enter \"password\" = \"${password}\"");
        step('I click the "login_submit_button" button');
    })
    .then('I should be on "(.*)"', function (url) {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + url);
    });