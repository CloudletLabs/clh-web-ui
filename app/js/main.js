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
        'gunttMainModule' : 'js/app/guntt/gunttMainModule',
        'gunttUserAndResourcesCtrl': 'js/app/guntt/controllers/gunttUserAndResourceController',
        'gunttDirecrives': 'js/app/guntt/directives/01_directives',
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
        'jqueryUI' : 'bower/jquery-ui/jquery-ui',
        'bootstrap': 'bower/bootstrap/dist/js/bootstrap.min',
        'markdown': 'bower/markdown/lib/markdown'
    },
    shim: {
        'jqueryUI': {
            deps: ['jquery'],
            exports: 'jqueryUI'
        },
        'angular': {
            deps: ['jqueryUI'],
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
            deps: ['bootstrap', 'markdown', 'indexControllers', 'services', 'gunttMainModule']
        }
    },
    deps: ['js/bootstrap']
});