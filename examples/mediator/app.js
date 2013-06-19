"use strict";

$(function(){ buildApplication(); });

var appConfig = {};
var app = new Backbone.Rebar.Application(appConfig);

var CustomView = Backbone.View.extend({
	handleAppLevelEvent:function(){
		var div = document.getElementById('application');
		div.innerHTML = div.innerHTML + "<em>Handling event from mediator</em>: Triggering event from " + this.cid+"<br>\n";
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
			var div = document.getElementById('application');
			div.innerHTML = div.innerHTML + "<em>Handling event from application</em>: Calling method on " + view.cid+"<br>\n";
			this.getViewByName("customView").handleAppLevelEvent();
		},
		handle:function(eventName,view,options){
			var div = document.getElementById('application');
			div.innerHTML = div.innerHTML + "Handling " + eventName + " triggered from " + view.cid +"<br>\n";
		}
	});

	mediator.addView(view,"viewLevelEvent");
	app.trigger("appLevelEvent");
}

