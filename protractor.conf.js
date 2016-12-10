var cucumber = require('protractor-jasmine-cucumber');

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    framework: 'jasmine',
    capabilities: {
        'browserName': 'chrome'
    },
    cucumberOpts: {
        tags: false,
        format: 'pretty',
        profile: false,
        'no-source': true
    },
    baseURL: 'http://localhost:8088/',
    specs: cucumber.injectFiles('e2e-tests/features/*Spec.js', 'e2e-tests/steps/*Definitions.js')
};