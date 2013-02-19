/**
 * @class CompositeView
 * @extends View
 */
var CompositeView = Rebar.CompositeView = Backbone.Rebar.View.extend({

	/**
	 * Creates an empty array where subview references can be push for later use.
	 * @method initialize
	 */
	initialize: function() {
		this.subViews = [];
		_.extend(this, _.pick(this.options, ["addSubView", "removeSubView", "destroy"]));
		View.prototype.initialize.call(this);
	},

	/**
	 * Adds a sub view to a container BaseView
	 * @method addSubView
	 * @param {BaseView} view
	 */
	addSubView: function(view) {
		if(!_.isFunction(view.destroy)){
			console.log("could not add view because it does not extend Rebar.View");
			return;
		}
		// only add views that extend Backbone.BaseView (our extention of the framework)
		this.subViews.push(view);
		view.parent = this;
		var delegate = this;
		view.render(function(el) {
			delegate.$el.append(el);
		});
	},

	addSubViews:function(views) {
		_.each(views,function(view){
			this.addSubView(view);
		},this);
	},

	/**
	 * Removes a sub view from the container view
	 * @method removeSubView
	 * @param {Object} view A base view or a cid of the sub view
	 */
	removeSubView: function(view) {
		// assuming that what was passed was not an actual view and in fact was a cid
		if(!view.cid) {
			view = _.where(this.subViews, {
				cid: view
			});
		}
		view.destroy(true);
		this.subViews = _.reject(this.subViews, function(subView) {
			return subView.cid === view.cid;
		});
	},

	/**
	 * Removes all sub views from view
	 * @method removeAllSubViews
	 */
	removeAllSubViews:function(){
		_.each(this.subViews,function(view){
			this.removeSubView(view);
		},this);
	},

	/**
	 * This method is a great helper method to call when the subclass view is about to be removed.
	 * It recursively will call destroy on any subviews reference in the sub views array. It also handles
	 * removing any event listeners that may have been added to the subViews array.
	 * @method destroy
	 */
	destroy: function(force) {

		if(!_.isUndefined(this.parent) && !_.isBoolean(force)) {
			this.parent.removeSubView(this);
			return false;
		}

		// recursively destroy sub views
		if(this.subViews.length > 0) {
			_.each(this.subViews, function(view) {
				view.destroy();
			});
		}

		this.subViews = [];

		View.prototype.destroy.call(this);
	}
});