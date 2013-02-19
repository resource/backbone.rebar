define(["rebar"], function() {
	
	var ContentModule = {};

	ContentModule.ContentView = Backbone.Rebar.CompositeView.extend({
		initialize: function() {
			var appController = Backbone.Rebar.Application.instance.controller;
			appController.on("routeDidChange", this.handleRouteChange,this);
			Backbone.Rebar.CompositeView.prototype.initialize.call(this);
		},
		addSubView:function(view){
			Backbone.Rebar.CompositeView.prototype.addSubView.call(this,view);
			view.transitionIn();
		},
		handleRouteChange: function(route) {

			// defaults
			var delegate = this;
			var directory = !_.isUndefined(route.directory) ? route.directory : "";
			var file = !_.isUndefined(route.file) ? route.file : "";
			var view = route.view;
			var resource = directory + "/" + file;
			var data = !_.isUndefined(route.data) ? route.data : {};

			// only continue if we have a directory
			if(resource === "/" || view === "") {
				if(ContentModule[view]) {
					var v = new ContentModule[view]();
					this.removeAllSubViews();
					this.addSubView(v);
				}
				return;
			}

			// load dependencies
			var mReq = require([resource], function(a) {
				var Constructor = a[view];
				if(_.isUndefined(Constructor)) {
					console.log("Error: view constructor is undefined");
					return;
				}
				var v = new Constructor({
					routeData: data
				});
				delegate.addSubView(v);
			}, function(e) {
				console.log("Error: " + e);
			});
		}
	});

	ContentModule.View1 = Backbone.Rebar.View.extend({
		className:"custom-one custom",
		render: function(callback) {
			this.$el.html("<p>Custom Subview One</p>");
			callback(this.el);
		},
		transitionIn:function(){
            this.$el.css("opacity", "0");
            this.$el.fadeTo(350, 1);
		}
	});

	ContentModule.View2 = Backbone.Rebar.View.extend({
		className:"custom-two custom",
		render: function(callback) {
			this.$el.html("<p>Custom Subview Two</p>");
			callback(this.el);
		},
		transitionIn:function(){
            this.$el.css("opacity", "0");
            this.$el.fadeTo(350, 1);
		}
	});

	return ContentModule;

});