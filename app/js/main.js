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
        'angular': 'bower/js/angular/angular',
        'angularRoute': 'bower/js/angular-route/angular-route',
        'angularLocalStorage': 'bower/js/angular-local-storage/dist/angular-local-storage',
        'angularAnimate': 'bower/js/angular-animate/angular-animate',
        'angularToastr': 'bower/js/angular-toastr/dist/angular-toastr.tpls',
        // 'cryptojslib': 'bower/cryptojslib/rollups/pbkdf2',
        'cryptojslib': 'bower/js/cryptojslib/rollups/rc4',
        'jquery': 'bower/js/jquery/dist/jquery',
        'bootstrap': 'bower/js/bootstrap/dist/js/bootstrap',
        'markdown': 'bower/js/markdown/lib/markdown'
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