// =======================================================================
// === Controller ========================================================
// =======================================================================
	
/**
 * The application shell provides a simple default architecture consisting of a model,
 * view and controller. The application is a singleton class in that there can only be one.
 * It extend `Backbone.Events` and you can see the [documentation](http://backbonejs.org/#Events)
 * for more detailed information.
 * @class Application
 * @constructor
 * @extends Backbone.Events
 * @example
 */
 var Controller = Rebar.Controller = function(){};
 Controller.prototype = Object.create(Backbone.Events,{});