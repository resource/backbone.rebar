"use strict";

// our application
var Application = Rebar.Application.extend({
	createRouter:null
});

// our model
var Model = Backbone.Model.extend();

// our view
var View = Rebar.View.extend({
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
var Controller = Rebar.Controller.extend({
	handleUserInteraction:function(value){
		this.model.set("foo","bar");
	}
});

// kick it all off
$(function(){
	// our instances
	var model = new Model({ foo:"foo" });
	var controller = new Controller({ model:model });
	var view = new View({ el:$("#foo-edit"), model:model, controller:controller });
	var application = new Application();

	application.view.addSubView(view);
	console.log(application);
});