/**
 * @class Controller
 * @extends Backbone.Events
 * @uses extend
 */
var Controller = Rebar.Controller = function(){};

Controller.prototype = Object.create(Backbone.Events);

Controller.extend = extend;