module.exports = function(grunt) {

    'use strict';

    var NAME = 'Backbone.Rebar';
    var DESCRIPTION = 'Adding a little bit more reinforcement to an already spectacular framework.';
    var URL = 'https://github.com/mcgaryes/rebar';
    var VERSION = '0.4.0';
    var BANNER = '/**\n * ' + NAME + ' v' + VERSION + '\n * ' + DESCRIPTION + '\n * ' + URL + '\n */\n';

    var path = require('path');
    var uglify = {};
    var srcpath = '../source/assets/js/';
    var destpath = '../www/assets/js/';

    grunt.file.expand({
        cwd: srcpath
    }, '**/*.js').forEach(function(relpath) {
        uglify[path.join(destpath, relpath)] = path.join(srcpath, relpath);
    });

    // config
    grunt.initConfig({
        uglify: {
            options: {},
            dist: {
                files: uglify
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
            code: {
                files: {
                    "../www/favicon.ico": "../source/favicon.ico",
                    "../www/index.html": "../source/index.html",
                    "../www/assets/css/main.css": "../source/assets/css/main.css",
                    "../www/assets/data/": "../source/assets/data/**",
                    "../www/assets/img/": "../source/assets/img/**"
                }
            },
        },
        yuidoc: {
            compile: {
                name: NAME,
                description: DESCRIPTION,
                version: VERSION,
                url: URL,
                options: {
                    paths: '../source/app/',
                    outdir: '../docs/'
                }
            }
        },
        jshint: {
            files: ['GruntFile.js', '../source/app/**/*.js'],
            options: {
                jshintrc: '../.jshintrc'
            }
        },
        requirejs: {
            all: {
                options: {
                    appDir: "../source/app",
                    baseUrl: "./",
                    mainConfigFile: "../source/app/main.js",
                    locale: "en-us",
                    dir: "../www/app",
                    optimize: "uglify",
                    name: "main",
                    fileExclusionRegExp: /^\./
                }
            }
        },
        sass: {
            all: {
                files: {
                    '../source/assets/css/main.css': '../source/assets/scss/main.scss'
                }
            }
        },
        watch: {
            all: {
                files: ['../source/assets/scss/*.scss'],
                tasks: ['sass'],
                options: {
                    nospawn: true
                }
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
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // tasks
    grunt.registerTask('default', ['jshint', 'requirejs', 'uglify', 'sass', 'copy:code', 'yuidoc']);

};