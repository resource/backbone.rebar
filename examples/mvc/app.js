"use strict";

// our application
var MyApplication = Rebar.Application.extend({
	createRouter:null
});

// our model
var MyModel = Backbone.Model.extend();

// our view
var MyView = Rebar.View.extend({
	events:{
		"click button":"buttonClick"
	},
	initialize:function(){
		this.model.on("change:foo",this.handleFooUpdate,this);
	},
	handleFooUpdate:function(){
		this.$el.find('p').text(this.model.get("foo"));
	},
	buttonClick:function(e){
		this.controller.handleUserInteraction();
	}
});

// our controller
var MyController = Rebar.Controller.extend({
	handleUserInteraction:function(value){
		this.model.set("foo","bar");
	}
});

// kick it all off
$(function(){
	// our instances
	var model = new MyModel({ foo:"foo" });
	var controller = new MyController({ model:model });
	var view = new MyView({ el:$("#application"), model:model, controller:controller });
	var application = new MyApplication();

	application.view.addSubView(view);
	console.log(application);
});