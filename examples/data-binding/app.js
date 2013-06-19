'use strict';

$(function() {
	buildApplication();
});

var app = new Backbone.Rebar.Application();

var CustomModel = Backbone.Model.extend({
	url:'./data.json',
	initialize:function(){
		// ...
	}
});

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

	setInterval(function(){
		if(model.get("foo") === "bar") {
			model.set("foo","foo");
		} else {
			model.set("foo","bar");
		}
	},2000);
}