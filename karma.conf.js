//jshint strict: false
module.exports = function(config) {
    config.set({

        basePath: '.',

        files: [
            { pattern: './build/bower/requirejs/require.js', included: false },
            { pattern: './build/bower/jquery/dist/jquery.min.js', included: false },
            { pattern: './build/bower/jquery-ui/jquery-ui.js', included: false },
            { pattern: './build/bower/bootstrap/dist/js/bootstrap.min.js', included: false },
            { pattern: './build/bower/angular/angular.min.js', included: false },
            { pattern: './bower_components/angular-mocks/angular-mocks.js', included: false },
            { pattern: './build/bower/**/*.js', included: false },
            { pattern: './app/js/**/*.js', included: false },
            { pattern: './unit-tests/spechelper.js', included: false },
            { pattern: './unit-tests/**/*Spec.js', included: false },
            './unit-tests/main-tests.js'
        ],
        exclude: [
            './app/js/main.js'
        ],

        singleRun: true,

        frameworks: ['jasmine', 'requirejs'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-requirejs',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-spec-reporter',
            'karma-coverage',
            'karma-junit-reporter'
        ],

        reporters: ['spec', 'coverage', 'junit'],

        preprocessors: {
            './app/js/**/*.js': ['coverage']
        },

        coverageReporter: {
            type: 'html',
            dir: 'test-results',

            reporters: [
                { type: 'html', file: 'unit-tests-coverage.html' },
                { type: 'text' },
                { type: 'text-summary' }
            ]
        },

        junitReporter: {
            outputDir: 'test-results',
            outputFile: 'unit-tests.xml',
            suite: 'unit'
        },

        // logLevel: config.LOG_DEBUG

    });
};