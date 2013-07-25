/*
 *
 * Config.js
 * The require config object sets the require.js configuration for your application
 * noting dependencies and paths. It also sets up any plugins that we may be using
 * within the application.
 *
 */
'use strict';
require.config({
	deps: ["main"],
	paths: {
		backbone: "../../assets/js/libs/backbone",
		jquery: "../../assets/js/libs/jquery",
		rebar: "../../assets/js/libs/backbone.rebar.min",
		underscore: "../../assets/js/libs/underscore"
	},
	shim: {
		'backbone': {
			deps: ['underscore'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		'jquery': {
			exports: '$'
		},
		'rebar': {
			deps: ['backbone'],
			exports: "Rebar"
		}
	}
});