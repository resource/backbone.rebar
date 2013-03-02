
'use strict';

/**
 * @namespace Rebar
 */
var Rebar = this.Rebar = Backbone.Rebar = {};

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