var feature = require('protractor-jasmine-cucumber').feature;

feature('Navigation')
    .scenario('Anonymous')
        .given('I go to "#/index"')
        .then('I should see Anonymous navigation')
    .scenario('User')
        .given('I logged in as "user"/"user"')
        .given('I go to "#/index"')
        .then('I should see User navigation')
    .scenario('Admin')
        .given('I logged in as "admin"/"admin"')
        .given('I go to "#/index"')
        .then('I should see Admin navigation');