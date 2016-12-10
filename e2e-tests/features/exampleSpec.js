var feature = require('protractor-jasmine-cucumber').feature;

feature('Example')
    .scenario('Protractor and Cucumber Test')
        .given('I go to "https://angularjs.org/"')
        .when('I add "Be Awesome" in the task field')
        .and('I click the add button')
        .then('I should see my new task in the list');