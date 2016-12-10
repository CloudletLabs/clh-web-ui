module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            dev: {
                dest: 'build/bower',
                options: {
                    expand: true,
                    packageSpecific: {
                        'angular': {
                            files: [
                                'angular.min.js'
                            ]
                        },
                        'angular-animate': {
                            files: [
                                'angular-animate.min.js'
                            ]
                        },
                        'angular-local-storage': {
                            files: [
                                'dist/angular-local-storage.min.js'
                            ]
                        },
                        'angular-route': {
                            files: [
                                'angular-route.min.js'
                            ]
                        },
                        'angular-toastr': {
                            files: [
                                'dist/angular-toastr.tpls.min.js',
                                'dist/angular-toastr.min.css'
                            ]
                        },
                        'angular-environment': {
                            files: [
                                'dist/angular-environment.min.js',
                            ]
                        },
                        'bootstrap': {
                            files: [
                                'dist/css/bootstrap.min.css',
                                'dist/fonts/*.*',
                                'dist/js/bootstrap.min.js'
                            ]
                        },
                        'cryptojslib': {
                            files: [
                                'rollups/pbkdf2.js'
                            ]
                        },
                        'jquery': {
                            files: [
                                'dist/jquery.min.js'
                            ]
                        },
                        'markdown': {
                            files: [
                                'lib/markdown.js'
                            ]
                        },
                        'requirejs': {
                            files: [
                                'require.js'
                            ]
                        }
                    }
                }
            }
        },
        jade: {
            compile: {
                options: {
                    pretty: false
                },
                files: [ {
                    cwd: 'app/views',
                    src: '**/*.jade',
                    dest: 'build',
                    expand: true,
                    ext: '.html'
                } ]
            }
        },
        copy: {
            build: {
                cwd: 'app',
                src: ['!js/**/*.js', 'css/**/*.css', 'img/**/*.*', '!**/*.jade'],
                dest: 'build',
                expand: true
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            build: {
                cwd: 'app',
                src: ['js/**/*.js', '!css/**/*.css', '!img/**/*.*', '!**/*.jade'],
                dest: 'build',
                expand: true
            }
        },
        connect: {
            server: {
                options: {
                    port: process.env.PORT || '8088',
                    base: 'build',
                    hostname: '*'
                }
            }
        },
        watch: {
            grunt: {files: ['Gruntfile.js']},
            jade: {
                files: 'app/views/**/*.jade',
                tasks: ['jade']
            },
            js: {
                files: 'app/js/**/*.js',
                tasks: ['uglify']
            },
            css: {
                files: 'app/css/**/*.css',
                tasks: ['copy']
            },
            img: {
                files: 'app/img/**/*.*',
                tasks: ['copy']
            }
        },
        protractor_webdriver: {
            options: {},
            e2e: {}
        },
        protractor: {
            options: {
                configFile: "protractor.conf.js",
                keepAlive: true,
                noColor: false
            },
            e2e: {}
        }
    });
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-protractor-webdriver');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.registerTask('default', "Default task to build a package",
        ['bower', 'jade', 'copy', 'uglify']);
    grunt.registerTask('start', "Start server",
        ['bower', 'jade', 'copy', 'uglify', 'connect', 'watch']);
    grunt.registerTask('e2e', "Start e2e",
        ['bower', 'jade', 'copy', 'uglify', 'connect', 'protractor_webdriver:e2e', 'protractor:e2e']);
};
