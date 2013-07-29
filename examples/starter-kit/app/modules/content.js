define([
	"rebar"
],
function(
	Rebar
) {

	"use strict";

	var ContentModule = {};

	// Initialize Model instance that fetches data from remote JSON file
	ContentModule.ContentRemoteData = Backbone.Model.extend({
		url: 'http://date.jsontest.com',
		initialize: function() { }
	});

	// Content View is a main Composite View that houses the various subviews
	// within the application. Subviews are added and removed as you navigate
	// through the routes within the application.
	ContentModule.ContentView = Backbone.Rebar.CompositeView.extend({
		initialize: function() {
			// Grab the application instance and listen for the
			// routeDidChange event
			var dispatcher = Backbone.Rebar.Application.instance;
			dispatcher.on("routeDidChange", this.handleRouteChange,this);
			Backbone.Rebar.CompositeView.prototype.initialize.call(this);
		},
		addSubView: function(view) {
			Backbone.Rebar.CompositeView.prototype.addSubView.call(this,view);

			// update the header title when a view is added
			var data = {
				"subtitle": view.subtitle,
				"headfoot": view.headfoot,
				"active": view.name
			};
			this.trigger("headerEvent", data);

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
			if (resource === "/" || view === "") {
				// initialize the new view, remove existing subviews
				// and add to the Content View
				if (ContentModule[view]) {
					var v = new ContentModule[view]();
					this.removeAllSubViews();
					this.addSubView(v);
				}
				return;
			}

			// load dependencies
			var mReq = require([resource], function(a) {
				var Constructor = a[view];
				if (_.isUndefined(Constructor)) {
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
		subtitle: "Custom Subview One",
		headfoot: true,
		name: "view1",
		template: _.template($('#view1-template').html()),

		events: {
			"submit": "submitForm"
		},

		initialize: function() {
			// initialize persistence model for view
			this.persistence = new Backbone.Rebar.PersistenceModel({
				url:"content-persistence"
			});
			this.persistence.fetch();

			Backbone.Rebar.View.prototype.initialize.call(this);
		},
		render: function(callback) {
			console.log("render view 1");
			var name = "";
			if (!_.isUndefined(this.persistence.get('view1-name'))) {
				name = this.persistence.get('view1-name');
			}

			// render template with fetched local data
			this.$el.html(this.template({
				name: name
			}));
			// update timestamp in persistence
			this.persistence.set("view1-timestamp",new Date().getTime());
			if (_.isFunction(callback)) {
				callback(this.el);
			}
		},
		destroy: function() {
			console.log("destroy view 1");
			// save persistence on view destroy
			this.persistence.save();
			Backbone.Rebar.View.prototype.destroy.call(this);
		},
		transitionIn: function() {
			this.$el.css("opacity", "0");
			this.$el.fadeTo(200, 1);
		},
		submitForm: function(e) {
			e.preventDefault();
			var name = $(e.currentTarget).find("#name").val();
			this.persistence.set("view1-name",name);
			this.persistence.save();
			this.render();
		}
	});

	ContentModule.View2 = Backbone.Rebar.View.extend({
		className: "custom-two custom",
		subtitle: "Custom Subview Two",
		headfoot: true,
		name: "view2",
		template: _.template($('#view2-template').html()),

		initialize: function() {
			this.persistence = new Backbone.Rebar.PersistenceModel({
				url: "content-persistence"
			});
			this.persistence.fetch();

			// render whenever the model is loaded
			this.remoteData = new ContentModule.ContentRemoteData();
			this.remoteData.on('sync', this.render, this);
			this.remoteData.fetch();

			Backbone.Rebar.View.prototype.initialize.call(this);
		},
		render: function(callback) {
			console.log("render view 2");
			this.$el.html(this.template({
				remoteData: this.remoteData
			}));
			this.persistence.set("view2-timestamp",new Date().getTime());
			if (_.isFunction(callback)) {
				callback(this.el);
			}
		},
		destroy: function() {
			console.log("destroy view 2");
			this.persistence.save();
			Backbone.Rebar.View.prototype.destroy.call(this);
		},
		transitionIn: function() {
			this.$el.css("opacity", "0");
			this.$el.fadeTo(200, 1);
		}
	});

	ContentModule.View3 = Backbone.Rebar.View.extend({
		className: "custom-three custom",
		subtitle: "Custom Subview Three",
		headfoot: false,
		name: "view3",
		template: _.template($('#view3-template').html()),

		initialize: function() {
			this.persistence = new Backbone.Rebar.PersistenceModel({
				url: "content-persistence"
			});
			this.persistence.fetch();

			Backbone.Rebar.View.prototype.initialize.call(this);
		},
		render: function(callback) {
			console.log("render view 3");
			this.$el.html(this.template({ }));
			this.persistence.set("view3-timestamp",new Date().getTime());
			if (_.isFunction(callback)) {
				callback(this.el);
			}
		},
		destroy: function() {
			console.log("destroy view 3");
			this.persistence.save();
			Backbone.Rebar.View.prototype.destroy.call(this);
		},
		transitionIn: function() {
			this.$el.css("opacity", "0");
			this.$el.fadeTo(200, 1);
		}
	});

	return ContentModule;

});