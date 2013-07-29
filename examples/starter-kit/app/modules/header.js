define([
    "rebar"
],
function(
    Rebar
) {

	"use strict";

	return Backbone.Rebar.CompositeView.extend({
		render: function(){
			this.$el.html(_.template($("#header-template").html(), {
                title: 'backbone.rebar Examples',
                subtitle: 'Starter Kit'
            }));
		}
	});

});