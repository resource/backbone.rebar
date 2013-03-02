
// =======================================================================
// === Dependency Router =================================================
// =======================================================================

/**
 * Handles all pre and post routing functionality. This is the default router when you initialize
 * an `Application` instance. Once initialized any time the browser's anchor location changes this
 * class notifies the rest of the application of the new directory, file, view and anchor to use.
 * To use simply listen to the application's `routeDidChange` or the router's `routeDidChange` event firing
 * and then implement the AMD loader that makes the most sense (for your project) to use.
 * @class DependencyRouter
 * @extends Backbone.Router
 * @constructor
 * @example
 *	// requirejs example
 *	router.on("routeDidChange", function(route){
 *		var mReq = require([resource], function(a) {
 *			var Constructor = a[view];
 *			var v = new Constructor({
 *				routeData: data
 *			});
 *			delegate.addSubView(v);
 *		}, function(e) {
 *			console.log("Error: " + e);
 *		});
 *	});
 */

var DependencyRouter = Rebar.DependencyRouter = function(options) {
	if (!_.isUndefined(options)) {
		if (!_.isUndefined(options.landing)) {
			this.landing = options.landing;
		}
		if (!_.isUndefined(options.staticRoutes)) {
			for(var route in options.staticRoutes) {
				this.setStaticRoute(route, options.staticRoutes[route]);
			}
		}
	}
	Backbone.Router.call(this, options);
};

DependencyRouter.prototype = Object.create(Backbone.Router.prototype, {

	/**
	 * Default landing for no hash. Where the browser will be routed to when landing
	 * on the root url of the applicaiton.
	 * @property landing
	 * @type {String}
	 * @default ""
	 */
	landing: {
		value: '',
		writable: true
	},

	/**
	 * Define only the route hash here because we'll be using dependency routing
	 * for the rest of the functionality.
	 * @property routes
	 * @type {Object} route key value pairs
	 * @default { "": "handleNoHash", "*splat": "handleAll" }
	 * @private
	 */
	routes: {
		value: {
			'': 'handleNoHash',
			'*splat': 'handleAll'
		},
		writable: true
	},

	/**
	 * This object is empty by default, but routes added here, either manually,
	 * or through the two methods, setStaticRoute and setStaticRoutes, will bypass
	 * the handleAll and handleNoHash methods referenced in the routes object.
	 * @property staticRoutes
	 * @type {Object} static route key value pairs
	 * @private
	 */
	staticRoutes: {
		value: {},
		writable: true
	},

	/**
	 * Reroute the page to the page referenced as landing
	 * @method handleNoHash
	 * @private
	 */
	handleNoHash: {
		value: function() {
			this.handleAll(this.landing + Backbone.history.location.search);
		},
		writable: true
	},

	/**
	 * Handles every route that doesnt match any of the previous matches
	 * @method handleAll
	 * @private
	 */
	handleAll: {
		value: function(route) {

			// reference the current url from backbone
			var routeString = _.isUndefined(route) ? Backbone.history.getFragment() : route;

			// check to make sure we dont have any static routes that were added
			for (var sRoute in this.staticRoutes) {
				if (sRoute === routeString) {
					this.staticRoutes[sRoute]();
					return;
				}
			}

			var pRoute = this.parseRoute(routeString);

			// now that we're sure that the current route is not one of the static routes set
			// then we'll move forward with the dependency routing functionality
			this.trigger('routeDidChange', pRoute);
			this.pRoute = pRoute;

		},
		writable: true
	},

	/**
	 * Parses a passed route string and determains directory, file, view and data
	 * @method parseRoute
	 * @param {String} route The current Backbone.history fragment
	 * @private
	 */
	parseRoute: {
		value: function(route) {

			var hash = route.split('/');
			var directory;
			var file;

			// define view and data
			var splitView = hash[hash.length - 1].split('?');

			// figure out view and anchor
			var viewParts = splitView[0].split('#');
			var view = viewParts[0];
			var anchor = route.split('#')[1];

			var data = this.parseRouteData(splitView[1]);

			// if only two parts are passed then we should assume that there is no directory and the two parts
			// are the file reference and the view reference is the view to instantiate
			if (hash.length === 2) {
				file = hash[0];
			}

			// this is the default behavior, 3 parts, directory, file and view
			if (hash.length === 3) {
				directory = hash[0];
				file = hash[1];
			}

			// here we're going to take everything before the last two parts of the has and concider them
			// to be directories
			if (hash.length > 3) {
				var dirLength = hash.length - 2;
				directory = '';
				for (var i = 0; i < dirLength; i++) {
					directory += hash[i] + (i < dirLength - 1 ? '/' : '');
				}
				file = hash[hash.length - 2];
			}

			return {
				directory: directory,
				file: file,
				view: view !== '' ? view : undefined,
				data: data,
				anchor: anchor
			};
		},
		writable: true
	},

	/**
	 * Parse the query string provides and returns key value pair object
	 * @method parseRouteData
	 * @param {String} query
	 * @private
	 */
	parseRouteData: {
		value: function(query) {
			if (_.isUndefined(query)) {
				return undefined;
			}
			var vars = query.split('&');
			var data = {};
			_.each(vars, function(v) {
				var pair = v.split('=');
				data[pair[0]] = pair[1];
			});
			return data;
		},
		writable: true
	},

	/**
	 * Takes a passed route object and determains a file location
	 * @method getFileLocation
	 * @param {Object} route Object formed in parseRoute method
	 * @private
	 */
	getFileLocation: {
		value: function(route) {
			if (_.isUndefined(route.directory) || route.directory === '') {
				if (_.isUndefined(route.file) || route.file === '') {
					return '';
				}
				return route.file;
			}
			return route.directory + '/' + route.file;
		},
		writable: true
	},

	/**
	 * Adds the name and method to the staticRoutes object as a key/value pair
	 * @method setStaticRoute
	 * @param {String} name
	 * @param {Function} method
	 */
	setStaticRoute: {
		value: function(name, method) {
			this.staticRoutes[name] = method;
		},
		writable: true
	},

	/**
	 * Takes key value pairs from an object and sets them to the staticRoutes
	 * object on the router
	 * @method setStaticRoutes
	 * @param {Object} routes
	 */
	setStaticRoutes: {
		value: function(routes) {
			for (var route in routes) {
				this.staticRoutes[route] = routes[route];
			}
		},
		writable: true
	}
});

DependencyRouter.extend = Backbone.Router.extend;
