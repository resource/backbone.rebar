$(function(){ buildApplication(); });

var appConfig = {};
var app = new Backbone.Rebar.Application(appConfig);

var CustomView = Backbone.View.extend({
	handleAppLevelEvent:function(){
		console.log("Handling method call from mediator");
		console.log("Triggering event from " + this.cid);
		this.trigger("viewLevelEvent");
	}
});

// create our view
var view = new CustomView({
	name:"customView"
});

function buildApplication(){
	app.startup();

	// create
	var mediator = new Backbone.Rebar.Mediator({
		dispatcher:app,
		events:{
			"appLevelEvent":"appLevelEventHandler"
		},
		appLevelEventHandler:function(options){
			console.log("Handling event from application");
			console.log("Calling method on " + view.cid);
			this.getViewByName("customView").handleAppLevelEvent();
		},
		handle:function(eventName,view,options){
			console.log("Handling " + eventName + " triggered from " + view.cid);
		}
	});

	mediator.addView(view,"viewLevelEvent");
	app.trigger("appLevelEvent");
}