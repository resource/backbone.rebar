/**
 * Simple implementation of the mediator pattern for use with Backbone.Views.
 * event architecture
 * @class Mediator
 * @constructor
 * @uses extend
 * @example
 *	var mediator = new Mediator({
 *		events:{
 *			"appwide1":{
 *				dispatcher:app
 *				callback:"method"
 *			}
 *		},
 *		initialize:function(options){
 *			...
 *		},
 *		method:function(e){
 *			...
 *		},
 *		handle:function(eventName,module){
 *			...
 *		}
 *	});
 *	mediator.addView(view,"event1 event2");
 *	view.trigger("something",view);
 *	mediator.removeView(view);
 */
var Mediator = Rebar.Mediator = function(options) {
	if(options) {
		this.options = options;
		_.extend(this, _.pick(this.options, ["initialize","handle"]));
		if(this.options.events) {
			this.processEvents(this.options.events);
		}
	}
	this._views = [];
	this.initialize(options);
};

Mediator.prototype = Object.create(Backbone.Events, {

	/**
	 * Stores reference to all views added to the mediator.
	 * @property _views
	 * @type Array
	 * @for Mediator
	 * @private
	 */
	_views: {
		value: undefined,
		writable: true,
		configurable: false
	},

	/**
	 * Called for any modules that extend the `Mediator` prototype.
	 * @method initialize
	 * @for Mediator
	 */
	initialize: {
		value: function(options) {},
		writable: true
	},

	/**
	 * Adds module as one that the mediator should be listening for events.
	 * @method addView
	 * @for Mediator
	 * @param {Backbone.View} view
	 * @param {String} eventNames
	 */
	addView: {
		value: function(view, eventNames) {
			var events;
			if(eventNames) {
				events = eventNames.split(" ");
			} else {
				events = ["all"];
			}
			_.each(events,function(eventName){
				view.on(eventName, function(options){
					this.handle(eventName,view,options);
				}, this);
			},this);
			this._views.push(view);
		},
		writable: true
	},

	/**
	 * Removes module from one that the mediator should be listening for.
	 * @method removeView
	 * @for Mediator
	 * @param {Backbone.View} view
	 */
	removeView: {
		value: function(view) {
			// @TODO: remove all events that the view has with this handler
			view.off(null, this.handle, this);
			this._views = _.reject(this._views, function(v) {
				if(v.cid === view.cid) {
					return true;
				}
				return false;
			}, this);
		},
		writable: true
	},

	/**
	 * Returns boolean for whether the mediator contains a view or not.
	 * @method hasView
	 * @for Mediator
	 * @param {Backbone.View} view
	 */
	hasView: {
		value: function(view) {
			return _.where(this._views, {
				cid: view.cid
			})[0];
		},
		writable: true
	},

	/**
	 * destroys a mediator and removes all listeners.
	 * @method destroy
	 * @for Mediator
	 */
	destroy: {
		value: function() {
			_.each(this._views, function(view) {
				this.removeView(view);
			}, this);
		},
		writable: true
	},

	/**
	 * Handler method that is called when one of the module the mediator is listening
	 * for is fired. Should be overriden in `Mediator` instances.
	 * @method handle
	 * @for Mediator
	 * @param {Object} eventName
	 * @param {Object} module
	 */
	handle: {
		value: function(eventName, view) {
			// ...
		},
		writable: true
	},

	/**
	 * Runs through all of the events that the mediator should be listening for.
	 * @method processEvents
	 * @for Mediator
	 * @param {Object} events
	 * @private
	 */
	processEvents: {
		value: function(events) {
			for(var item in events) {
				var eventObj = events[item];
				if(_.isObject(eventObj)) {
					this.assignCallbackToDispatcher(item, eventObj.callback, eventObj.dispatcher);
				} else {
					this.assignCallbackToDispatcher(item, eventObj, this.options.dispatcher);
				}
			}
		}
	},

	/**
	 * Assigns a callback to the passed dispatcher for the event to be fired.
	 * @method assignCallbackToDispatcher
	 * @for Mediator
	 * @param {String} eventName
	 * @param {String} callbackName
	 * @param {Object} dispatcher
	 * @private
	 */
	assignCallbackToDispatcher: {
		value: function(eventName, callbackName, dispatcher) {
			if(this[callbackName]) {
				dispatcher.on(eventName, this[callbackName], this);
			} else if(this.options[callbackName]) {
				dispatcher.on(eventName, this.options[callbackName], this);
			} else {
				console.error("Error: No method '" + callbackName + "' found on mediator");
			}
		}
	}
});

Mediator.extend = extend;