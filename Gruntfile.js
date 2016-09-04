module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        jade: {
            compile: {
                options: {
                    client: false,
                    pretty: true
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
                src: ['js/**/*.js', 'css/**/*.css', 'img/**/*.*', '!**/*.jade'],
                dest: 'build',
                expand: true
            }
        },
        bower: {
            dev: {
                dest: 'build/bower',
                options: {
                    expand: true,
                    packageSpecific: {
                        'bootstrap': {
                            files: [
                                'dist/css/bootstrap.css',
                                'dist/fonts/*.*',
                                'dist/js/bootstrap.js'
                            ]
                        },
                        'markdown': {
                            files: [
                                'lib/markdown.js'
                            ]
                        },
                        'cryptojslib': {
                            files: [
                                'rollups/pbkdf2.js'
                            ]
                        }
                    }
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 4000,
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
                tasks: ['copy']
            },
            css: {
                files: 'css/**/*.css',
                tasks: ['copy']
            },
            img: {
                files: 'img/**/*.*',
                tasks: ['copy']
            }
        }
    });
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask('default', "Convert Jade templates into html templates",
        ['jade', 'copy', 'bower', 'connect', 'watch']);
};
