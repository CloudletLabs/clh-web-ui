var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

afterEach(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
});

featureSteps()
    .given('I go to "(.*)"', function (site) {
        browser.get(browser.baseUrl + site);
        browser.waitForAngular();
    })
    .given('I logged in as "(.*)"/"(.*)"', function (username, password) {
        this.given('I go to "#/login"');
        this.when('I enter "username" = "' + username + '"');
        this.when('I enter "password" = "' + password + '"');
        this.when('I click the button "Login"');
        browser.waitForAngular();
    })
    .when('I enter "(.*)" = "(.*)"', function (fieldModel, value) {
        element(by.model('vm.' + fieldModel)).clear().sendKeys(value);
        browser.waitForAngular();
    })
    .when('I click the button "(.*)"', function (buttonText) {
        element(by.buttonText(buttonText)).click();
        browser.waitForAngular();
    })
    .then('I should be on "(.*)"', function (url) {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + url);
    })
    .then('I should be logged in as "(.*)"', function (userDisplayName) {
        var username = element(by.binding('vm.currentUser.name'));
        expect(username.getText()).toEqual(userDisplayName);
    })
    .then('I should get a message "(.*)"', function (message) {
        var popup = element(by.css('.toast.toast-success'));
        browser.wait(protractor.ExpectedConditions.visibilityOf(popup), 5000);
        var text = popup.element(by.css('.toast-message'));
        expect(popup.isDisplayed()).toBeTruthy();
        expect(text.getText()).toEqual(message);
    })
    .then('I should get an error "(.*)"', function (message) {
        var popup = element(by.css('.toast.toast-error'));
        browser.wait(protractor.ExpectedConditions.visibilityOf(popup), 5000);
        var text = popup.element(by.css('.toast-message'));
        expect(popup.isDisplayed()).toBeTruthy();
        expect(text.getText()).toEqual(message);
    });