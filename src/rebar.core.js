	'use strict';

/**
 * @namespace Rebar
 */
var Rebar = this.Rebar = Backbone.Rebar = {};

// =======================================================================
// === Pollyfills ========================================================
// =======================================================================

if (!Object.create) {
	Object.create = function(o) {
		if (arguments.length > 1) {
			throw new Error('Object.create implementation only accepts the first parameter.');
		}
		function F() {}
		F.prototype = o;
		return new F();
	};
}

// =======================================================================
// === Helpers ===========================================================
// =======================================================================

/**
 * Extention functionality for the prototyped object that implements it.
 * @method extend
 * @param {Object} protoProps
 * @return {Object} child
 */
var extend = function(protoProps) {
	var parent = this;
	var child = function() {
		parent.apply(this, arguments);
	};
	child.prototype = _.extend(parent.prototype, protoProps);
	return child;
};