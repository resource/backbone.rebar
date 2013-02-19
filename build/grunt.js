module.exports = function(grunt) {

    "use strict";

    var NAME = "JavaScript Web Application Starterkit";
    var DESCRIPTION = "A light JavaScript application structure that keeps extendibility and best practices in mind.";
    var URL = "https://github.com/mcgaryes/javascript-webapp-starterkit";
    var VERSION = "0.4.0";

    // config
    grunt.initConfig({
        lint: {
            files: ['grunt.js', '../backbone.rebar.js']
        },
        min: {
            all: {
                src: ['../backbone.rebar.js'],
                dest: '../backbone.rebar.min.js'
            }
        },
        combine: {
            all: {
                input: "../src/rebar.core.js",
                output: "../backbone.rebar.js",
                tokens: [{
                    token:"//pre//",
                    string:"(function(Backbone,_,$){"
                },{
                    token:"//post//",
                    string:"}).call(this,Backbone,_,$);"
                },{
                    token: "//rebar.services//",
                    file: "../src/rebar.services.js"
                },{
                    token: "//rebar.application//",
                    file: "../src/rebar.application.js"
                },{
                    token: "//rebar.persistence-model//",
                    file: "../src/rebar.persistence-model.js"
                },{
                    token: "//rebar.mediator//",
                    file: "../src/rebar.mediator.js"
                }, {
                    token: "//rebar.view//",
                    file: "../src/rebar.view.js"
                },{
                    token: "//rebar.composite-view//",
                    file: "../src/rebar.composite-view.js"
                },{
                    token: "//rebar.dependency-router//",
                    file: "../src/rebar.dependency-router.js"
                },{
                    token: "//rebar.controller//",
                    file: "../src/rebar.controller.js"
                }]
            }
        },
        jsbeautifier: {
            files: ["../backbone.rebar.js"],
            options: {
                "indent_size": 4
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                es5: true,
                smarttabs: false,
                strict: true
            },
            globals: {
                yui: true,
                Worker: false,
                Blob: false,
                postMessage: false,
                _:false,
                Backbone:false,
                $:false,
                localStorage:false
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-jasmine-task');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-combine');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // tasks
    grunt.registerTask('default', ['combine', 'lint', 'min', 'jsbeautifier']);

};