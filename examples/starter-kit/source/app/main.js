'use strict';

require.config({
	deps: ["main"],
	paths: {
		underscore: "../assets/js/underscore",
		backbone: "../assets/js/backbone",
		jquery: "../assets/js/jquery",
		monkeybars: "../assets/js/monkeybars",
		rebar: "../assets/js/backbone.rebar"
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

require(["rebar", "monkeybars", "modules/header", "modules/content", "modules/footer"], function(Rebar, MonkeyBars, HeaderView, ContentModule, FooterView) {

	var application;

	// Initialize the application core
	var createApplication = new MonkeyBars.Task({
		name: "initializeApplication",
		performTask: function() {
			application = new Backbone.Rebar.Application({
				landing: "View1",
				bootstrap: "/assets/data/bootstrap.json",
				viewOptions:{
					transitionIn:function(callback,context){
						this.$el.css("opacity",1);
						Rebar.View.prototype.transitionIn.call(context,callback);
					}
				}
			});
			console.log(application);
			this.complete();
		}
	});

	// build the application views
	var buildApplication = new MonkeyBars.Task({
		name: "initializeApplication",
		performTask: function() {
			var content = new ContentModule.ContentView({
				el: $("#content")
			});
			var header = new HeaderView({
				el: $("#header")
			});
			var footer = new FooterView({
				el: $("#footer")
			});
			application.view.addSubViews([content, header, footer]);
			this.complete();
		}
	});

	// functionality that starts Backbone history and transitions the first page in
	var startApplication = new MonkeyBars.Task({
		name: "startApplication",
		performTask: function() {
			application.on("applicationStateDidChange", function(state, error) {
				if (state === Rebar.Application.States.Started) {
					this.complete();
				} else if (state === Rebar.Application.States.Faulted) {
					this.fault(error);
				}
			}, this);
			application.startup();
		}
	});

	// startup task functionaliuty
	var startup = new MonkeyBars.SequenceTask({
		name: "startup",
		logLevel: MonkeyBars.LogLevels.Verbose,
		tasks: [createApplication, buildApplication, startApplication],
		onComplete:function(){
			application.view.transitionIn();
		},
		onFault: function(error) {
			window.alert(error);
		}
	});

	$(function() {
		startup.start();
	});

});