// =======================================================================
// === Controller ========================================================
// =======================================================================

/**
 * Simple controller object.
 * @class Controller
 * @constructor
 * @extends Backbone.Events
 * @uses extend
 * @TODO Determine what other functionality needs to be a part of the controller.
 */
var Controller = Rebar.Controller = function(options) {
	if (!_.isUndefined(options)) {
		this.options = options;
		_.extend(this, _.pick(this.options, ['model']));
	}
};

Controller.prototype = Object.create(Backbone.Events, {
	/**
	 * Reference to the model the controller will be interacting with
	 * @property model
	 * @type Backbone.Model
	 */
	model: {
		value: undefined,
		writable: true
	}
});

Controller.extend = extend;