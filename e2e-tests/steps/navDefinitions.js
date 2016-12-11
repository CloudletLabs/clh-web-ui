var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

featureSteps('Navigation')
    .then('I should see Anonymous navigation', function () {
        var logo = element(by.linkText('CloudletHub'));
        expect(logo.getAttribute('href')).toEqual(browser.baseUrl + '#/index');
        expect(logo.isDisplayed()).toBeTruthy();

        var login = element(by.linkText('Login'));
        expect(login.getAttribute('href')).toEqual(browser.baseUrl + '#/login');
        expect(login.isDisplayed()).toBeTruthy();

        var register = element(by.linkText('Register'));
        expect(register.getAttribute('href')).toEqual(browser.baseUrl + '#/register');
        expect(register.isDisplayed()).toBeTruthy();

        var users = element(by.linkText('Users'));
        expect(users.isPresent()).toBeFalsy();

        var actions = element(by.linkText('Actions'));
        expect(actions.isPresent()).toBeFalsy();

        var username = element(by.binding('vm.currentUser.name'));
        expect(username.isDisplayed()).toBeFalsy();
    })
    .then('I should see User navigation', function () {
        var logo = element(by.linkText('CloudletHub'));
        expect(logo.getAttribute('href')).toEqual(browser.baseUrl + '#/index');
        expect(logo.isDisplayed()).toBeTruthy();

        var login = element(by.linkText('Login'));
        expect(login.isPresent()).toBeFalsy();

        var register = element(by.linkText('Register'));
        expect(register.isPresent()).toBeFalsy();

        var users = element(by.linkText('Users'));
        expect(users.isPresent()).toBeFalsy();

        var actions = element(by.linkText('Actions'));
        expect(actions.isDisplayed()).toBeTruthy();

        actions.click();
        browser.waitForAngular();
        var addNews = element(by.linkText('Add News'));
        expect(addNews.isPresent()).toBeFalsy();

        var addUser = element(by.linkText('Add User'));
        expect(addUser.isPresent()).toBeFalsy();

        var username = element(by.binding('vm.currentUser.name'));
        expect(username.isDisplayed()).toBeTruthy();

        username.click();
        browser.waitForAngular();
        var logout = element(by.linkText('Logout'));
        expect(actions.isDisplayed()).toBeTruthy();
    })
    .then('I should see Admin navigation', function () {
        var logo = element(by.linkText('CloudletHub'));
        expect(logo.getAttribute('href')).toEqual(browser.baseUrl + '#/index');
        expect(logo.isDisplayed()).toBeTruthy();

        var login = element(by.linkText('Login'));
        expect(login.isPresent()).toBeFalsy();

        var register = element(by.linkText('Register'));
        expect(register.isPresent()).toBeFalsy();

        var users = element(by.linkText('Users'));
        expect(users.getAttribute('href')).toEqual(browser.baseUrl + '#/users');
        expect(users.isDisplayed()).toBeTruthy();

        var actions = element(by.linkText('Actions'));
        expect(actions.isDisplayed()).toBeTruthy();

        actions.click();
        browser.waitForAngular();
        var addNews = element(by.linkText('Add News'));
        expect(addNews.getAttribute('href')).toEqual(browser.baseUrl + '#/news');
        expect(addNews.isDisplayed()).toBeTruthy();

        var addUser = element(by.linkText('Add User'));
        expect(addUser.getAttribute('href')).toEqual(browser.baseUrl + '#/user');
        expect(addUser.isDisplayed()).toBeTruthy();

        var username = element(by.binding('vm.currentUser.name'));
        expect(username.isDisplayed()).toBeTruthy();

        username.click();
        browser.waitForAngular();
        var logout = element(by.linkText('Logout'));
        expect(actions.isDisplayed()).toBeTruthy();
    });