/**
 * Handles all pre and post routing functionality
 * @class DependencyRouter
 * @constructor
 * @extends Backbone.Router
 * @main
 */
var DependencyRouter = Rebar.DependencyRouter = Backbone.Router.extend({

	/**
	 * Default landing for no hash. Where the browser will be routed to when landing
	 * on the root url of the applicaiton.
	 * @property landing
	 * @type {String}
	 * @default
	 */
	landing: "",

	/**
	 * Define only the route hash here because we'll be using dependency routing
	 * for the rest of the functionality.
	 * @property routes
	 * @type {Object} route key value pairs
	 * @default { "": "handleNoHash", "*splat": "handleAll" }
	 */
	routes: {
		"": "handleNoHash",
		"*splat": "handleAll"
	},

	/**
	 * This object is empty by default, but routes added here, either manually,
	 * or through the two methods, setStaticRoute and setStaticRoutes, will bypass
	 * the handleAll and handleNoHash methods referenced in the routes object.
	 * @property staticRoutes
	 * @type {Object} static route key value pairs
	 */
	staticRoutes: {},

	/**
	 * Router init functionality
	 * @method initialize
	 * @param {Object} options
	 */
	initialize: function(options) {
		if(!_.isUndefined(options)) {
			if(!_.isUndefined(options.landing)) {
				this.landing = options.landing;
			}
			if(!_.isUndefined(options.controller)) {
				this.controller = options.controller;
			}
		}
	},

	/**
	 * Reroute the page to the page referenced as landing
	 * @method handleNoHash
	 */
	handleNoHash: function() {
		this.handleAll(this.landing + Backbone.history.location.search);
	},

	/**
	 * Handles every route that doesnt match any of the previous matches
	 * @method handleAll
	 */
	handleAll: function(route) {

		// reference the current url from backbone
		var routeString = _.isUndefined(route) ? Backbone.history.getFragment() : route;

		// check to make sure we dont have any static routes that were added
		for(var sRoute in this.staticRoutes) {
			if(sRoute === routeString) {
				this.staticRoutes[sRoute]();
				return;
			}
		}

		var pRoute = this.parseRoute(routeString);
		var router = this;
		var directory = this.getFileLocation(pRoute);

		// now that we're sure that the current route is not one of the static routes set
		// then we'll move forward with the dependency routing functionality
		this.controller.trigger("routeDidChange",pRoute);
		this.pRoute = pRoute;

	},

	/**
	 * Parses a passed route string and determains directory, file, view and data
	 * @method parseRoute
	 * @param {String} route The current Backbone.history fragment
	 */
	parseRoute: function(route) {

		var hash = route.split("/");
		var directory;
		var file;

		// define view and data
		var splitView = hash[hash.length - 1].split("?");

		// figure out view and anchor
		var viewParts = splitView[0].split("#");
		var view = viewParts[0];
		var anchor = viewParts[1];

		var data = this.parseRouteData(splitView[1]);

		// if only two parts are passed then we should assume that there is no directory and the two parts
		// are the file reference and the view reference is the view to instantiate
		if(hash.length === 2) {
			file = hash[0];
		}

		// this is the default behavior, 3 parts, directory, file and view
		if(hash.length === 3) {
			directory = hash[0];
			file = hash[1];
		}

		// here we're going to take everything before the last two parts of the has and concider them
		// to be directories
		if(hash.length > 3) {
			var dirLength = hash.length - 2;
			directory = "";
			for(var i = 0; i < dirLength; i++) {
				directory += hash[i] + (i < dirLength - 1 ? "/" : "");
			}
			file = hash[hash.length - 2];
		}

		return {
			directory: directory,
			file: file,
			view: view !== "" ? view : undefined,
			data: data,
			anchor: anchor
		};
	},

	/**
	 * Parse the query string provides and returns key value pair object
	 * @method parseRouteData
	 * @param {String} query
	 */
	parseRouteData: function(query) {
		if(_.isUndefined(query)) {
			return undefined;
		}
		var vars = query.split('&');
		var data = {};
		_.each(vars, function(v) {
			var pair = v.split("=");
			data[pair[0]] = pair[1];
		});
		return data;
	},

	/**
	 * Takes a passed route object and determains a file location
	 * @method getFileLocation
	 * @param {Object} route Object formed in parseRoute method
	 */
	getFileLocation: function(route) {
		if(_.isUndefined(route.directory) || route.directory === "") {
			if(_.isUndefined(route.file) || route.file === "") {
				return "";
			}
			return route.file;
		}
		return route.directory + "/" + route.file;
	},

	/**
	 * Adds the name and method to the staticRoutes object as a key/value pair
	 * @method setStaticRoute
	 * @param {String} name
	 * @param {Function} method
	 */
	setStaticRoute: function(name, method) {
		this.staticRoutes[name] = method;
	},

	/**
	 * Takes key value pairs from an object and sets them to the staticRoutes
	 * object on the router
	 * @method setStaticRoutes
	 * @param {Object} routes
	 */
	setStaticRoutes: function(routes) {
		for(var route in routes) {
			this.staticRoutes[route] = routes[route];
		}
	},

	/**
	 * Functionality used when a reqirejs module causes an error. This essentially
	 * just navigates the user to the 404 module and does not add the navigation to the
	 * browsers history stack.
	 * @method handleModuleLoadError
	 */
	handleModuleLoadError: function() {
		console.log("error");
	}

});