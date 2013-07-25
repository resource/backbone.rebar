'use strict';
define([
    "rebar"
],
function(
    Rebar
) {
	return Backbone.Rebar.CompositeView.extend({
		render: function(callback){
			this.$el.html(_.template($("#footer-template").html()));
		}
	});
});