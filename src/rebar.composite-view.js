// =======================================================================
// === Composite View ====================================================
// =======================================================================

/**
 * Most of the time Backbone views need to be able to contain other views. When you do this you run
 * into situations where you need to add the view then render and when you go to destroy the parent
 * view, you want to make sure you properly dispose of its children.
 * The composite view makes managing child parent relationships a bit easier by adding recursive destroy
 * functionality as well as making it possible to quickly add and remove child views.
 * @class CompositeView
 * @extends View
 * @constructor
 * @example
 *	var composite = new Backbone.Rebar.CompositeView({
 *		...
 *	});
 *	var view = new Backbone.Rebar.View({
 *		...
 *	});
 *	composite.addSubView(view);
 */
var CompositeView = Rebar.CompositeView = function(options) {
	this.subViews = [];
	View.call(this, options);
	//_.extend(this, _.pick(this.options, ['addSubView', 'removeSubView', 'removeAllSubViews', 'destroy']));
};

CompositeView.prototype = Object.create(View.prototype, {

	/**
	 * Adds a sub view to a container BaseView
	 * @method addSubView
	 * @param {View} view
	 */
	addSubView: {
		value: function(view) {
			// add event listeners for view
			view.on('viewDidDestroy', function(view) {
				this.removeSubView(view);
			}, this);
			// add sub view
			this.subViews.push(view);
			// render subview
			var delegate = this;
			view.render(function(el) {
				var markup = el ? el : view.el;
				delegate.$el.append(markup);
			});
			// @TODO - possibly trigger view has been added
		},
		writable: true
	},

	/**
	 * Adds an array of sub views to a container BaseView
	 * @method addSubViews
	 * @param {Array} views Array of subviews
	 */
	addSubViews: {
		value: function(views) {
			_.each(views, function(view) {
				this.addSubView(view);
			}, this);
		},
		writable: true
	},

	/**
	 * Removes a sub view from the container view
	 * @method removeSubView
	 * @param {Object} view A base view or a cid of the sub view
	 */
	removeSubView: {
		value: function(view) {
			// assuming that what was passed was not an actual view and in fact was a cid
			if (!view.cid) {
				view = _.where(this.subViews, {
					cid: view
				})[0];
			}
			this.destroySubView(view);
			this.subViews = _.reject(this.subViews, function(subView) {
				return subView.cid === view.cid;
			});
		},
		writable: true
	},

	/**
	 * Removes all sub views from view
	 * @method removeAllSubViews
	 */
	removeAllSubViews: {
		value: function() {
			_.each(this.subViews, function(view) {
				this.removeSubView(view);
			}, this);

		},
		writable: true
	},

	/**
	 * This method is a great helper method to call when the subclass view is about to be removed.
	 * It recursively will call destroy on any subviews reference in the sub views array. It also handles
	 * removing any event listeners that may have been added to the subViews array.
	 * @method destroy
	 */
	destroy: {
		value: function() {
			// recursively destroy sub views
			if (this.subViews.length > 0) {
				_.each(this.subViews, function(view) {
					this.destroySubView(view);
				}, this);
			}
			this.subViews = [];
			View.prototype.destroy.call(this);
		},
		writable: true
	},

	/**
	 * Checks to see if the passed view has destroy functionality and then if it does not
	 * calls the prototype destroy functionality and passes the reference
	 * @method destroySubView
	 * @param {View} view
	 */
	destroySubView: {
		value: function(view) {
			if (_.isFunction(view.destroy)) {
				view.destroy(true);
			} else {
				if (!_.isUndefined(view.cid)) {
					View.prototype.destroy.call(view);
				}
			}
		},
		writable: true
	}
});

CompositeView.extend = View.extend;