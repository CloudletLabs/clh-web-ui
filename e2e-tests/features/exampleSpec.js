var feature = require('protractor-jasmine-cucumber').feature;

feature('Login')
    .scenario('Success')
        .given('I go to "#/login"')
        .when('I enter username "admin" and password "admin"')
        .and('I click the Login button')
        .then('I should be logged in');