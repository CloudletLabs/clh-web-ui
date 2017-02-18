var cucumber = require('protractor-jasmine-cucumber');
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    framework: 'jasmine2',
    capabilities: {
        'browserName': 'chrome'
    },
    cucumberOpts: {
        tags: false,
        format: 'pretty',
        profile: false,
        'no-source': true
    },
    onPrepare: function() {
        global.onPrepareTimestamp = new Date().getTime();
        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: 'none'
        }));
        // returning the promise makes protractor wait for the reporter config before executing tests
        return global.browser.getProcessedConfig().then(function(config) { });
    },
    jasmineNodeOpts: {
        showColors: true,
        silent: true,
        print: function () { }
    },
    plugins: [{
        package: 'protractor-screenshoter-plugin',
        screenshotPath: 'test-results/e2e',
        screenshotOnExpect: 'failure',
        screenshotOnSpec: 'failure',
        writeReportFreq: 'asap',
        clearFoldersBeforeTest: true
    }],
    baseUrl: 'http://localhost:8088/',
    specs: cucumber.injectFiles('e2e-tests/features/*Spec.js', 'e2e-tests/steps/*Definitions.js')
};