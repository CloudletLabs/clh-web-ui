require.config({
    baseUrl: '',
    paths: {
        'app': 'js/app',
        'indexControllers': 'js/app/controllers/indexControllers',
        'loginControllers': 'js/app/controllers/loginControllers',
        'usersControllers': 'js/app/controllers/usersControllers',
        'newsControllers': 'js/app/controllers/newsControllers',
        'services': 'js/app/services',
        'directives': 'js/app/directives',
        'filters': 'js/app/filters',
        'version': 'js/app/version',
        'angular': 'bower/angular/angular.min',
        'angularRoute': 'bower/angular-route/angular-route.min',
        'angularLocalStorage': 'bower/angular-local-storage/dist/angular-local-storage.min',
        'angularAnimate': 'bower/angular-animate/angular-animate.min',
        'angularToastr': 'bower/angular-toastr/dist/angular-toastr.tpls.min',
        'angularEnvironment': 'bower/angular-environment/dist/angular-environment.min',
        'cryptojslib': 'bower/cryptojslib/rollups/pbkdf2',
        'jquery': 'bower/jquery/dist/jquery.min',
        'bootstrap': 'bower/bootstrap/dist/js/bootstrap.min',
        'markdown': 'bower/markdown/lib/markdown'
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
        'bootstrap': ['jquery'],
        'indexControllers': {
            deps: ['cryptojslib', 'angularEnvironment', 'loginControllers', 'usersControllers', 'newsControllers']
        },
        'app': {
            deps: ['bootstrap', 'markdown', 'indexControllers', 'services']
        }
    },
    deps: ['js/bootstrap']
});