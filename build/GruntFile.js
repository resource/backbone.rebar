module.exports = function(grunt) {

    'use strict';

    var NAME = 'Backbone.Rebar';
    var DESCRIPTION = 'Extends the Backbone library with view transitions, subviews, view mediators, local storage for sync, dynamic route definitions, controllers, and a simple log wrapper.';
    var URL = 'https://github.com/resource/backbone.rebar';
    var VERSION = '1.0.0';
    var BANNER = '/**\n * ' + NAME + ' v' + VERSION + '\n * ' + DESCRIPTION + '\n * ' + URL + '\n */\n';
    var LOGO = "../rebar.png";


    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // config
    grunt.initConfig({
        uglify: {
            options: {
                banner: BANNER
            },
            dist: {
                files: {
                    '../backbone.rebar.min.js': ['../backbone.rebar.js']
                }
            }
        },
        jasmine: {
            all: {
                options: {
                    specs: '../tests/specs/*.js',
                    template: '../tests/custom.tmpl'
                }
            }
        },
        copy: {
            docs: {
                files: [{
                        src: ['../backbone.rebar.js'],
                        dest: '../temp/backbone.rebar.js'
                    }
                ]
            },
            version: {
                options: {
                    processContent: function() {
                        return VERSION;
                    }
                },
                files: {
                    "../VERSION": "../VERSION"
                }
            },
            examples: {
                files: [{
                        src: ['../backbone.rebar.min.js'],
                        dest: '../examples/assets/js/libs/backbone.rebar.min.js'
                    }
                ]
            }
        },
        yuidoc: {
            project: {
                name: NAME,
                description: DESCRIPTION,
                version: VERSION,
                url: URL,
                logo: LOGO,
                options: {
                    paths: '../temp/',
                    outdir: '../docs/'
                }
            }
        },
        jshint: {
            files: ['grunt.js', '../backbone.rebar.js'],
            options: {
                jshintrc: '../.jshintrc'
            }
        },
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: [
                        '../src/rebar.intro.js',
                        '../src/rebar.core.js',
                        '../src/rebar.application.js',
                        '../src/rebar.persistence-model.js',
                        '../src/rebar.view.js',
                        '../src/rebar.composite-view.js',
                        '../src/rebar.mediator.js',
                        '../src/rebar.controller.js',
                        '../src/rebar.dependency-router.js',
                        '../src/rebar.logger.js',
                        '../src/rebar.outro.js'
                ],
                dest: '../backbone.rebar.js'
            }
        },
        jsbeautifier: {
            files: ['../backbone.rebar.js'],
            options: {
                'indent_size': 4,
                "max_preserve_newlines": 1,
            }
        }
    });

    // tasks
    grunt.registerTask('docs', ['copy:docs', 'yuidoc']);
    grunt.registerTask('dev', ['jasmine', 'concat', 'jsbeautifier', 'jshint']);
    grunt.registerTask('default', ['dev', 'uglify', 'docs', 'copy:version', 'copy:examples']);

};