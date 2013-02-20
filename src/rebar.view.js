/**
 * @class View
 * @extends Backbone.View
 */
var View = Rebar.View = Backbone.View.extend({

	/**
	 * @method initialize
	 */
	initialize:function(){
		_.extend(this, _.pick(this.options, ["render", "destroy", "transitionIn", "transitionOut"]));
	},

	/**
	 * This method is a great helper method to call when the subclass view is about to be removed.
	 * It recursively will call destroy on any subviews reference in the sub views array. It also handles
	 * removing any event listeners that may have been added to the subViews array.
	 * @method destroy
	 */
	destroy: function() {
		this.off();
		this.$el.off();
		this.remove();
	},

	/**
	 * For instances that are used in dependency routing the render method is called
	 * and used directly after loading. For all other uses you must call render manually.
	 * @method render
	 * @param {Function} callback
	 */
	render: function(callback) {},

	/**
	 * Transitions in the view. By default this method actually does nothing.
	 * @method transitionIn
	 * @param {Function} callback
	 */
	transitionIn: function(callback, context) {
		if(_.isFunction(callback)) {
			callback.call(context ? context : this);
		}
	},

	/**
	 * Transitions out the view. By default this method actually does nothing.
	 * @method transitionOut
	 * @param {Function} callback
	 */
	transitionOut: function(callback, context) {
		if(_.isFunction(callback)) {
			callback.call(context ? context : this);
		}
	}
});