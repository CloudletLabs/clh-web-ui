var feature = require('protractor-jasmine-cucumber').feature;

feature('News')
    .scenario('List')
        .given('I go to "#/index"')
        .then('I should see a news list')
    .scenario('Slug')
        .given('I go to "#/news/hello-world"')
        .then('I should see a single news');

feature('News: Admin')
    .scenario('Add test news')
        .given('I logged in as "admin"/"admin"')
        .when('I create test news')
        .then('I should see the new test news');