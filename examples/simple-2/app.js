"use strict";

var app = new Rebar.Application();

var ColorsModel = Backbone.Model.extend({
	colors:[{
		id:"blue",
		hex:"#045e77"
	},{
		id:"yellow",
		hex:"#dfdd64"
	},{
		id:"red",
		hex:"#95005e"
	}],
	color:"blue",
	initialize:function(){
		this.on("change:color",this.handleColorChange,this);
	},
	getHexForId:function(id){
		return _.where(this.colors,{id:id})[0].hex;
	}
});

var ContentView = Rebar.View.extend({
	id:"content",
	initialize:function(){
		this.model.on("change:color",this.handleColorChange,this);
	},
	render: function(callback) {
		this.$el.html(_.template($("#content-template").html(), {
			cid: this.cid
		}));
		this.handleColorChange(this.model,this.model.color);
		callback(this.el);
	},
	handleColorChange:function(model,colorId){
		var color = this.model.getHexForId(colorId);
		this.model.set("color",colorId);
		this.$el.css({
			"background-color" : color
		}).html("You have selected "+colorId);
	}
});

var ControlsView = Rebar.View.extend({
	id:"controls",
	events:{
		"change input":  "handleColorSelected"
	},
	render: function(callback) {
		this.$el.html(_.template($("#controls-template").html(), {
			cid: this.cid
		}));
		callback(this.el);
	},
	handleColorSelected:function(e){
		this.trigger("colorChange",$(e.currentTarget).val());
	}
});

function buildApp() {

	// create the colors model
	var colors = new ColorsModel();

	// create the content view
	var contentView = new ContentView({ model:colors });

	// create controls view and mediator
	var controlsView = new ControlsView();
	var mediator = new Rebar.Mediator({
		view:controlsView,
		viewEvents:"colorChange",
		handle:function(eventName,view,options){
			colors.set("color",options);
		}
	});

	// add the views to the main app view
	app.view.addSubViews([controlsView,contentView]);
}

// dom ready
$(function() {

	buildApp();

});