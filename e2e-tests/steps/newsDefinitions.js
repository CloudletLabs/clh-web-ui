var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

featureSteps('News')
    .then('I should see a news list', function () {
        element.all(by.repeater('news in vm.news')).then(function (news) {
            expect(news.length).not.toBeLessThan(2);
            var validateCurrentNews = function (currentNews, subject, creator, html) {
                expect(currentNews.element(by.binding('news.subject')).getText()).toEqual(subject);
                currentNews.element(by.binding('news.creator.name')).getText().then(function (text) {
                    var props = text.split('||');
                    expect(props[0]).toEqual(creator + ' ');
                    expect(new Date(props[1])).toEqual(jasmine.any(Date));
                });
                expect(currentNews.element(by.binding('news.html')).getAttribute('innerHTML')).toEqual(html);
            };
            validateCurrentNews(news[news.length - 2], 'Second News', 'Admin', '<p>This is a second test news!</p>');
            validateCurrentNews(news[news.length - 1], 'Hello World!', 'Admin',
                '<p><strong>This</strong> is a <strong>first</strong> test news! <code>Welcome!</code></p>');
        });
    })
    .then('I should see a single news', function () {
        expect(element(by.binding('vm.currentNews.subject')).getText()).toEqual('Hello World!');
        element(by.binding('vm.currentNews.creator.name')).getText().then(function (text) {
            var props = text.split('||');
            expect(props[0]).toEqual('Admin ');
            expect(new Date(props[1])).toEqual(jasmine.any(Date));
        });
        expect(element(by.binding('vm.currentNews.html')).getAttribute('innerHTML')).toEqual(
            '<p><strong>This</strong> is a <strong>first</strong> test news! <code>Welcome!</code></p>');
    });

featureSteps('News: Admin')
    .when('I create test news', function () {
        this.given('I go to "#/news"');
        element(by.model('vm.newNews.subject')).clear().sendKeys('Test News ' + onPrepareTimestamp);
        element(by.model('vm.newNews.text')).clear().sendKeys('*Test* Text');
        this.when('I click the "create_news_button"');
    })
    .then('I should see the new test news', function () {
        this.then('I should be on "#/news/test-news-' + onPrepareTimestamp + '"');
        expect(element(by.binding('vm.currentNews.subject')).getText()).toEqual('Test News ' + onPrepareTimestamp);
        element(by.binding('vm.currentNews.creator.name')).getText().then(function (text) {
            var props = text.split('||');
            expect(props[0]).toEqual('Admin ');
            expect(new Date(props[1])).toEqual(jasmine.any(Date));
        });
        expect(element(by.binding('vm.currentNews.html')).getAttribute('innerHTML')).toEqual(
            '<p><em>Test</em> Text</p>');
    });