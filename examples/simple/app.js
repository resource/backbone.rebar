"use strict";

$(function(){ buildApplication(); });

var applicationConfig = {

};

var application;

function buildApplication(){
	application = new Backbone.Rebar.Application(applicationConfig);
	application.startup();
	buildViews();
}

function buildViews(){

	// way to add templates to use in render
	var mainView = new Backbone.Rebar.View({
		name:"mainView",
		events:{
			"click":"destroy"
		},
		render:function(callback){
			this.$el.append("<button>Click me to destroy</button>");
			callback(this.el);
		}
	});

	application.view.addSubView(mainView);
}