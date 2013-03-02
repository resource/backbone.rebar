module.exports = function(grunt) {

    'use strict';

    var NAME = 'Backbone.Rebar';
    var DESCRIPTION = 'Adding a little bit more reinforcement to an already spectacular framework.';
    var URL = 'https://github.com/mcgaryes/rebar';
    var VERSION = '0.4.0';
    var BANNER = '/**\n * ' + NAME + ' v' + VERSION + '\n * ' + DESCRIPTION + '\n * ' + URL + '\n */\n';
    var LOGO = "../rebar.png";


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
                }]
            },
            pages: {
                files: [{
                    src: ['../docs/**'],
                    dest: '../../backbone-rebar-pages/docs/'
                }]
            },
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
                    '../src/rebar.outro.js'],
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

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // tasks
    grunt.registerTask('docs', ['copy:docs', 'yuidoc', 'copy:pages']);
    grunt.registerTask('dev', ['jasmine', 'concat', 'jsbeautifier', 'jshint']);
    grunt.registerTask('default', ['dev', 'uglify', 'docs']);
    
};