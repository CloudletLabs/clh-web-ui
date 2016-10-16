var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

require.config({
    baseUrl: '/base',
    paths: {
        'app': 'build/js/app',
        'indexControllers': 'build/js/app/controllers/indexControllers',
        'loginControllers': 'build/js/app/controllers/loginControllers',
        'usersControllers': 'build/js/app/controllers/usersControllers',
        'newsControllers': 'build/js/app/controllers/newsControllers',
        'services': 'build/js/app/services',
        'directives': 'build/js/app/directives',
        'filters': 'build/js/app/filters',
        'version': 'build/js/app/version',
        'angular': 'build/bower/angular/angular.min',
        'angularRoute': 'build/bower/angular-route/angular-route.min',
        'angularLocalStorage': 'build/bower/angular-local-storage/dist/angular-local-storage.min',
        'angularAnimate': 'build/bower/angular-animate/angular-animate.min',
        'angularToastr': 'build/bower/angular-toastr/dist/angular-toastr.tpls.min',
        'angularEnvironment': 'build/bower/angular-environment/dist/angular-environment.min',
        'angularMock': 'bower_components/angular-mocks/angular-mocks',
        'cryptojslib': 'build/bower/cryptojslib/rollups/pbkdf2',
        'jquery': 'build/bower/jquery/dist/jquery.min',
        'bootstrap': 'build/bower/bootstrap/dist/js/bootstrap.min',
        'markdown': 'build/bower/markdown/lib/markdown'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angularRoute': {
            deps: ['angular'],
            exports: 'angularRoute'
        },
        'angularAnimate': {
            deps: ['angular'],
            exports: 'angularAnimate'
        },
        'angularLocalStorage': {
            deps: ['angular'],
            exports: 'angularLocalStorage'
        },
        'angularToastr': {
            deps: ['angularAnimate'],
            exports: 'angularToastr'
        },
        'angularEnvironment': {
            deps: ['angular', 'angularRoute', 'angularLocalStorage', 'angularAnimate', 'angularToastr'],
            exports: 'angularEnvironment'
        },
        'angularMock' :{
            deps: ['angularEnvironment'],
            exports : 'angularMock'
        },
        'bootstrap': ['jquery'],
        'indexControllers': {
            deps: ['cryptojslib', 'angularMock', 'loginControllers', 'usersControllers', 'newsControllers']
        },
        'app': {
            deps: ['bootstrap', 'markdown', 'indexControllers', 'services']
        }
    },
    deps: tests,
    callback: window.__karma__.start
});