define(["rebar"], function() {
	
	var ContentModule = {};

	ContentModule.ContentView = Backbone.Rebar.CompositeView.extend({
		initialize: function() {
			var dispatcher = Backbone.Rebar.Application.instance;
			dispatcher.on("routeDidChange", this.handleRouteChange,this);
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
		initialize:function(){
			this.persistence = new Backbone.Rebar.PersistenceModel({
				url:"content-persistence"
			});
			this.persistence.fetch();
			Backbone.Rebar.View.prototype.initialize.call(this);
		},
		render: function(callback) {
			this.$el.html("<p>Custom Subview One</p>");
			this.persistence.set("view1-timestamp",new Date().getTime());
			callback(this.el);
		},
		destroy:function(){
			this.persistence.save();
			Backbone.Rebar.View.prototype.destroy.call(this);
		},
		transitionIn:function(){
            this.$el.css("opacity", "0");
            this.$el.fadeTo(350, 1);
		}
	});

	ContentModule.View2 = Backbone.Rebar.View.extend({
		className:"custom-two custom",
		initialize:function(){
			this.persistence = new Backbone.Rebar.PersistenceModel({
				url:"content-persistence"
			});
			this.persistence.fetch();
			Backbone.Rebar.View.prototype.initialize.call(this);
		},
		render: function(callback) {
			this.$el.html("<p>Custom Subview Two</p>");
			this.persistence.set("view2-timestamp",new Date().getTime());
			callback(this.el);
		},
		destroy:function(){
			this.persistence.save();
			Backbone.Rebar.View.prototype.destroy.call(this);
		},
		transitionIn:function(){
            this.$el.css("opacity", "0");
            this.$el.fadeTo(350, 1);
		}
	});

	return ContentModule;

});