'use strict';
require.config({
	deps: ["main"],
	paths: {
		underscore: "libs/underscore",
		backbone: "libs/backbone",
		jquery: "libs/jquery",
		monkeybars: "libs/monkeybars",
		rebar: "backbone.rebar"
	},
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		'jquery': {
			exports: '$'
		},
		'monkeybars': {
			exports: 'MonkeyBars'
		},
		'rebar': {
			deps: ['backbone'],
			exports: "Rebar"
		}
	}
});

require(["rebar", "monkeybars", "header", "content", "footer"], function(Rebar, MonkeyBars, HeaderView, ContentModule, FooterView) {

	var application;
	var appConfig = {
		landing: "",
		bootstrap: "bootstrap.json",
		dependencyRouting:true
	};

	// @TODO: how do I overwrite the transitionIn functionality on the application view

	// Initialize the application core
	var createApplication = new MonkeyBars.Task({
		name: "initializeApplication",
		performTask: function() {
			application = new Backbone.Rebar.Application(appConfig);
			this.complete();
		}
	});

	// build the application views
	var buildApplication = new MonkeyBars.Task({
		name: "initializeApplication",
		performTask: function() {
			var content = new ContentModule.ContentView({ el: $("#content") });
            var header = new HeaderView({ el: $("#header") });
            var footer = new FooterView({ el: $("#footer") });
            application.view.addSubViews([content,header,footer]);
			this.complete();
		}
	});

	// functionality that starts Backbone history and transitions the first page in
	var startApplication = new MonkeyBars.Task({
		name: "startApplication",
		performTask: function() {
			application.start(function() {
				this.complete();
			}, this);
		}
	});

	// startup task functionaliuty
	var startup = new MonkeyBars.SequenceTask({
		name: "startup",
		logLevel: MonkeyBars.LogLevels.Verbose,
		tasks: [createApplication, buildApplication, startApplication],
		onFault: function(error) {
			window.alert(error);
		}
	});

	$(function() {
		startup.start();
	});

});