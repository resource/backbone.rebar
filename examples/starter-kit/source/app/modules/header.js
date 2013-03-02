define(["rebar"],function(Rebar){

	"use strict";

	return Backbone.Rebar.CompositeView.extend({
		render:function(){
			this.$el.html(_.template($("#footer-template").html()));
		}
	});
	
});