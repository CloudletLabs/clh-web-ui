require.config({
    baseUrl: '',
    paths: {
        'env': 'js/env',
        'app': 'js/app',
        'controllers': 'js/app/controllers',
        'services': 'js/app/services',
        'directives': 'js/app/directives',
        'filters': 'js/app/filters',
        'version': 'js/app/version',
        'angular': 'bower/angular/angular.min',
        'angularRoute': 'bower/angular-route/angular-route.min',
        'angularLocalStorage': 'bower/angular-local-storage/dist/angular-local-storage.min',
        'angularAnimate': 'bower/angular-animate/angular-animate.min',
        'angularToastr': 'bower/angular-toastr/dist/angular-toastr.tpls.min',
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
        'bootstrap': ['jquery'],
        'app': {
            deps: ['cryptojslib', 'angular', 'angularToastr', 'bootstrap', 'markdown', 'env', 'controllers', 'services']
        }
    },
    deps: ['js/bootstrap']
});