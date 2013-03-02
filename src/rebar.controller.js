
// =======================================================================
// === Controller ========================================================
// =======================================================================
	
/**
 * Simple controller object.
 * @class Controller
 * @constructor
 * @extends Backbone.Events
 * @uses extend
 * @TODO Determain what other functionality needs to be a part of the controller.
 */
 var Controller = Rebar.Controller = function(){};

 Controller.prototype = Object.create(Backbone.Events,{});
 
 Controller.extend = extend;