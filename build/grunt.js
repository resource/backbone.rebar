module.exports = function(grunt) {

    "use strict";

    var NAME = "Backbone.Rebar";
    var DESCRIPTION = "Adding a little bit more reinforcement to an already spectacular framework.";
    var URL = "https://github.com/mcgaryes/rebar";
    var VERSION = "0.4.0";
    var BANNER = "/**\n * " + NAME + " v" + VERSION + "\n * " + DESCRIPTION + "\n * " + URL + "\n */";

    // config
    grunt.initConfig({
        lint: {
            files: ['grunt.js', '../backbone.rebar.js']
        },
        meta: {
            banner: BANNER
        },
        min: {
            all: {
                src: ['<banner>', '../backbone.rebar.js'],
                dest: '../backbone.rebar.min.js'
            }
        },
        jasmine: {
            all: {
                src: ['../tests/index.html'],
                errorReporting: true
            }
        },
        jsbeautifier: {
            files: ["../backbone.rebar.js"],
            options: {
                "indent_size": 4
            }
        },
        copy: {
            docs: {
                files: {
                    "../temp/backbone.rebar.js": "../backbone.rebar.js"
                }
            }
        },
        yuidoc: {
            compile: {
                "name": NAME,
                "description": DESCRIPTION,
                "version": VERSION,
                "url": URL,
                options: {
                    paths: "../temp/",
                    outdir: "../docs/"
                }
            }
        },
        combine: {
            all: {
                input: "../src/rebar.core.js",
                output: "../backbone.rebar.js",
                tokens: [{
                    token: "//pre//",
                    string: BANNER + "\n" + "(function (Backbone, _, $) {"
                }, {
                    token: "//post//",
                    string: "}).call(this,Backbone,_,$);"
                }, {
                    token: "//rebar.services//",
                    file: "../src/rebar.services.js"
                }, {
                    token: "//rebar.application//",
                    file: "../src/rebar.application.js"
                }, {
                    token: "//rebar.persistence-model//",
                    file: "../src/rebar.persistence-model.js"
                }, {
                    token: "//rebar.view//",
                    file: "../src/rebar.view.js"
                }, {
                    token: "//rebar.composite-view//",
                    file: "../src/rebar.composite-view.js"
                }, {
                    token: "//rebar.dependency-router//",
                    file: "../src/rebar.dependency-router.js"
                }]
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
                _: false,
                Backbone: false,
                $: false,
                localStorage: false
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
    grunt.registerTask('docs', ['copy:docs', 'yuidoc']);
    grunt.registerTask('default', ['jasmine', 'combine', 'lint', 'min', 'jsbeautifier', 'docs']);

};