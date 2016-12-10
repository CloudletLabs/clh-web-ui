var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

featureSteps('Example')
    .given('I go to "(.*)"', function (site) {
        browser.get(site);
    })
    .when('I add "(.*)" in the task field', function (task) {
        element(by.model('todoList.todoText')).sendKeys(task);
    })
    .when('I click the add button', function () {
        var el = element(by.css('[value="add"]'));
        el.click();
    })
    .then('I should see my new task in the list', function () {
        var todoList = element.all(by.repeater('todo in todoList.todos'));
        expect(todoList.count()).toEqual(3);
        expect(todoList.get(2).getText()).toEqual('Be Awesome');
    });