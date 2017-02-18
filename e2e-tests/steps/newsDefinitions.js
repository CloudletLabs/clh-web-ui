var featureSteps = require('protractor-jasmine-cucumber').featureSteps;

var validateNewsProps = function(text, creator) {
    text.then(function (text) {
        var props = text.split('||');
        expect(props[0]).toEqual(creator + ' ');
        expect(new Date(props[1])).toEqual(jasmine.any(Date));
    });
};

featureSteps('News')
    .then('I should see a news list', function () {
        element.all(by.repeater('news in vm.news')).then(function (news) {
            expect(news.length).not.toBeLessThan(2);
            var validateCurrentNews = function (currentNews, subject, creator, html) {
                expect(currentNews.element(by.binding('news.subject')).getText()).toEqual(subject);
                validateNewsProps(currentNews.element(by.binding('news.creator.name')).getText(), creator);
                expect(currentNews.element(by.binding('news.html')).getAttribute('innerHTML')).toEqual(html);
            };
            validateCurrentNews(news[news.length - 2], 'Second News', 'Admin', '<p>This is a second test news!</p>');
            validateCurrentNews(news[news.length - 1], 'Hello World!', 'Admin',
                '<p><strong>This</strong> is a <strong>first</strong> test news! <code>Welcome!</code></p>');
        });
    })
    .then('I should see a hello-world news', function () {
        expect(element(by.binding('vm.currentNews.subject')).getText()).toEqual('Hello World!');
        validateNewsProps(element(by.binding('vm.currentNews.creator.name')).getText(), 'Admin');
        expect(element(by.binding('vm.currentNews.html')).getAttribute('innerHTML')).toEqual(
            '<p><strong>This</strong> is a <strong>first</strong> test news! <code>Welcome!</code></p>');
    })
    .then('I should see a second-news news', function () {
        expect(element(by.binding('vm.currentNews.subject')).getText()).toEqual('Second News');
        validateNewsProps(element(by.binding('vm.currentNews.creator.name')).getText(), 'Admin');
        expect(element(by.binding('vm.currentNews.html')).getAttribute('innerHTML')).toEqual(
            '<p>This is a second test news!</p>');
    });

featureSteps('News: Admin')
    .when('I create test news', function () {
        this.given('I go to "#!/news"');
        element(by.model('vm.newNews.subject')).clear().sendKeys('Test News ' + onPrepareTimestamp);
        element(by.model('vm.newNews.text')).clear().sendKeys('*Test* Text');
        this.when('I click the button "Create"');
    })
    .when('I modify test news', function () {
        this.given('I go to "#!/news/test-news-' + onPrepareTimestamp + '"');
        this.when('I click the button "Edit"');
        element(by.model('vm.currentNews.subject')).clear().sendKeys('Test News ' + onPrepareTimestamp + ' [UPDATED]');
        element(by.model('vm.currentNews.text')).clear().sendKeys('*Test* Text (updated)');
        this.when('I click the button "Update"');
    })
    .when('I delete test news', function () {
        this.given('I go to "#!/news/test-news-' + onPrepareTimestamp + '"');
        this.when('I click the button "Delete"');
    })
    .then('I should see the new test news', function () {
        this.then('I should be on "#!/news/test-news-' + onPrepareTimestamp + '"');
        expect(element(by.binding('vm.currentNews.subject')).getText()).toEqual('Test News ' + onPrepareTimestamp);
        validateNewsProps(element(by.binding('vm.currentNews.creator.name')).getText(), 'Admin');
        expect(element(by.binding('vm.currentNews.html')).getAttribute('innerHTML')).toEqual(
            '<p><em>Test</em> Text</p>');
    })
    .then('I should see modified test news', function () {
        this.then('I should be on "#!/news/test-news-' + onPrepareTimestamp + '"');
        expect(element(by.binding('vm.currentNews.subject')).getText()).toEqual(
            'Test News ' + onPrepareTimestamp + ' [UPDATED]');
        validateNewsProps(element(by.binding('vm.currentNews.creator.name')).getText(), 'Admin');
        expect(element(by.binding('vm.currentNews.html')).getAttribute('innerHTML')).toEqual(
            '<p><em>Test</em> Text (updated)</p>');
    })
    .then('I should not see deleted test news', function () {
        this.given('I go to "#!/news/test-news-' + onPrepareTimestamp + '"');
        this.then('I should be on "#!/404"');
        this.then('I should get an error "News with thus slug not found"');
    });