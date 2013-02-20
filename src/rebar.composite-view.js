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
		_.extend(this, _.pick(this.options, ["addSubView", "removeSubView", "removeAllSubViews", "destroy"]));
		View.prototype.initialize.call(this);
	},

	/**
	 * Adds a sub view to a container BaseView
	 * @method addSubView
	 * @param {BaseView} view
	 */
	addSubView: function(view) {
		// only add views that extend Backbone.BaseView (our extention of the framework)
		this.subViews.push(view);
		view.parent = this;
		var delegate = this;
		// @TODO: not sure if I should be calling the render functionality here or not
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
			})[0];
		}
		this.destroySubView(view);
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
				this.destroySubView(view);
			},this);
		}

		this.subViews = [];

		View.prototype.destroy.call(this);
	},

	/**
	 * Checks to see if the passed view has destroy functionality and then if it does not
	 * calls the prototype destroy functionality and passes the reference
	 * @method destroySubView
	 * @param {View} view
	 */
	destroySubView:function(view){
		if(_.isFunction(view.destroy)) {
			view.destroy(true);
		} else {
			if(!_.isUndefined(view.cid)){
				console.warn("Warning: No 'destroy' method found on 'view' " + view.cid + ". Falling back to Rebar.View.prototype.");
				View.prototype.destroy.call(view);
			}
		}
	}
});