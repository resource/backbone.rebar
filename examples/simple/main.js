'use strict';
require.config({
	deps: ["main"],
	paths: {
		underscore: "../../libs/underscore",
		backbone: "../../libs/backbone",
		jquery: "../../libs/jquery",
		rebar: "../../backbone.rebar"
	},
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		'jquery': {
			exports: '$'
		},
		'rebar': {
			deps: ['backbone'],
			exports: "Rebar"
		}
	}
});

require(["rebar"], function(Rebar) {

	require(["holder","component","component2","mediator"],function(HolderView,ComponentView,Component2View,ComponentMediator){

		var h = new HolderView({
			el:$("#holder")
		});

		var mediator = new ComponentMediator({
			initialize:function(){
				var c1 = new ComponentView({
					mediator:this
				});

				h.addSubViews([c1]);
			}
		});

	});


});