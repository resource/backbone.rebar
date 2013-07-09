'use strict';

$(function() {
	buildApplication();
});

// Initialize Application instance
var app = new Backbone.Rebar.Application();

// Initialize Model instance that fetches data from local JSON file
var CustomModel = Backbone.Model.extend({
	url:'./data.json',
	initialize:function(){
		// ...
	}
});

// Initialize Rebar View that listens to changes in the 'foo' property of
// the model
var CustomView = Rebar.View.extend({
	initialize:function(){
		// bindings
		this.model.on('change:foo',this.handleFooChange,this);
	},
	handleFooChange:function(){
		this.$el.find(".foo").text(this.model.get("foo"));
	},
	render:function(callback){
		this.$el.html("<h1 class='foo'></h1>");
		callback(this.el);
	}
});

function buildApplication() {

	var model = new CustomModel();

	var view = new CustomView({ model:model });
	app.view.addSubView(view);

	model.fetch();
	
	// The model 'foo' property value is toggled at an interval and the UI is
	// updated automatically as it listens to the change events on that property. 
	setInterval(function(){
		if(model.get("foo") === "bar") {
			model.set("foo","foo");
		} else {
			model.set("foo","bar");
		}
	},2000);
}