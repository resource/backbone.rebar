/**
 * Backbone.Rebar v0.4.0
 * Adding a little bit more reinforcement to an already spectacular framework.
 * https://github.com/mcgaryes/rebar
 */
(function(Backbone, _, $) {

    "use strict";

    /**
     * @namespace Backbone.Rebar
     */
    var Rebar = Backbone.Rebar = {};

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

    // =======================================================================
    // === Services ==========================================================
    // =======================================================================

    /**
     * Static class with boilerplate functionality for jquery ajax requests
     * @class Services
     * @static
     */
    var Services = Rebar.Services = {

        /**
         * jQuery wrapper for ajax() calls
         * @method request
         * @param {Object} options
         * @param {Object} context
         * @private
         * @for Services
         */
        request: function(type, options, context) {

            // options
            var opts = this.parseOptions(options);
            var id = opts.id;
            var error = opts.error;
            var success = opts.success;
            var data = opts.data;
            var delegate = this;
            var url = opts.url;

            // create ajax object
            var o = {};

            // set the url passed
            o.url = opts.url ? opts.url : (opts.id ? this.getServiceEndpointById(id) : undefined);

            // set the data passed
            if (!_.isUndefined(data)) {
                o.data = data;
            }

            // set the success funx
            o.success = function(response) {
                if (!_.isEmpty(response)) {
                    delegate.handleSuccess(context, success, response);
                } else {
                    delegate.handleError(context);
                }
            };

            // set the error funx
            o.error = function(e) {
                delegate.handleError(context, error, e);
            };

            o.cache = false;
            o.dataType = 'json';
            o.type = type;

            // call ajax
            $.ajax(o);

        },

        /**
         * Parses the incoming options object to the http method and returns
         * a useable options object for the request
         * @method parseOptions
         * @param {Object} options
         * @private
         * @for Services
         */
        parseOptions: function(options) {
            return {
                id: options.id ? options.id : undefined,
                error: options.error ? options.error : function() {},
                success: options.success ? options.success : function() {},
                data: options.data ? options.data : undefined,
                url: options.url ? options.url : undefined
            };
        },

        /**
         * Processes the error object returned by the http request
         * @method parseError
         * @param {Object} error
         * @private
         * @for Services
         */
        parseError: function(error) {
            var temp = {};
            if (_.isUndefined(error) || _.isEmpty(error) || _.isNull(error)) {
                temp.code = 204;
                temp.message = "No Content";
            } else {
                temp.code = error.status;
                temp.message = error.statusText;
            }
            temp.originalError = error;
            return temp;
        },

        /**
         * jquery success handler
         * @method handleSuccess
         * @param {Object} context
         * @param {Function} callback
         * @param {Object} response
         * @private
         * @for Services
         */
        handleSuccess: function(context, callback, response) {
            callback.call(context, response);
        },

        /**
         * jquery ajax error handler
         * @method handleError
         * @param {Object} context
         * @param {Function} callback
         * @param {Object} response
         * @private
         * @for Services
         */
        handleError: function(context, callback, response) {
            callback.call(context, this.parseError(response));
        },

        /**
         * GET request
         * @method get
         * @param {Object} options
         * @param {Object} context
         * @for Services
         */
        get: function(options, context) {
            this.request("GET", options, context);
        },

        /**
         * POST request
         * @method post
         * @param {Object} options
         * @param {Object} context
         * @for Services
         */
        post: function(options, context) {
            this.request("POST", options, context);
        },

        /**
         * PUT request
         * @method put
         * @param {Object} options
         * @param {Object} context
         * @for Services
         */
        put: function(options, context) {
            this.request("PUT", options, context);
        },

        /**
         * DELETE request
         * @method delete
         * @param {Object} options
         * @param {Object} context
         * @for Services
         */
        delete: function(options, context) {
            this.request("DELETE", options, context);
        }
    };

    // =======================================================================
    // === Application =======================================================
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
     *	var appConfig = {
     *		...	
     *	};
     *	var app = new Backbone.Rebar.Application(appConfig);
     *	app.on("applicationStateChange",function(state){
     *		...
     *	});
     *	app.startup();
     */
    var Application = Rebar.Application = function(options) {
        // singleton functionality
        if (Application.instance && !options._bypassSingleton) {
            return Application.instance;
        }
        if (options && options.logLevel) {
            Application.logLevel = options.logLevel;
        } else {
            Application.logLevel = Application.LogLevel.None;
        }
        Application.instance = this;
        this.options = options;
        this.state = Application.States.Initialized;
    };

    /**
     * Available loglevels used in various logging tasks throughout the applicaiton.
     * @property LogLevel
     * @type Object
     * @for Application
     * @final
     */
    Application.LogLevel = {
        None: 0,
        Error: 10,
        Info: 20,
        Verbose: 30
    };

    /**
     * Available states for the application used to describe the current state of the applicaiton.
     * @property States
     * @type Object
     * @for Application
     * @final
     */
    Application.States = {
        Default: 0,
        Initialized: 1,
        Started: 3,
        Faulted: 2
    };

    Application.prototype = Object.create(Backbone.Events, {

        /**
         * The current state value.
         * @property _state
         * @type Integer
         * @for Application
         * @private
         */
        _state: {
            value: Application.States.Default,
            writable: true
        },

        /**
         * Getters and setters for the current state value.
         * @property state
         * @type Integer
         * @for Application
         */
        state: {
            get: function() {
                return this._state;
            },
            set: function(state) {
                if (this._state === state) {
                    return;
                }
                this._state = state;
                if (this._state === Application.States.Initialized) {
                    this.createModel();
                    this.createView();
                    this.createRouter();
                    this.initialize(this.options);
                }
                this.trigger("applicationStateDidChange", this.state);
            }
        },

        /**
         * Reference to the services object.
         * @property services
         * @type Services
         * @for Application
         */
        services: {
            value: Services,
            writable: false
        },

        /**
         * Initialization functionality for extended Applicaiton instances.
         * @method initialize
         * @for Application
         */
        initialize: {
            value: function(options) {},
            writable: true
        },

        /**
         * Create a model instance for the Applicaiton instance.
         * @method createModel
         * @for Application
         */
        createModel: {
            value: function() {
                if (!this.model) {
                    this.model = new Backbone.Model();
                }
            },
            writable: true
        },

        /**
         * Create a view instance for the Applicaiton instance.
         * @method createView
         * @for Application
         */
        createView: {
            value: function() {
                if (!this.view) {
                    this.view = new CompositeView({
                        el: $("#application")
                    });
                }
            },
            writable: true
        },

        /**
         * Create a dependency router instance for the Applicaiton instance.
         * @method createRouter
         * @for Application
         */
        createRouter: {
            value: function() {
                if (!this.router) {
                    this.router = new DependencyRouter({
                        landing: this.options.landing ? this.options.landing : "",
                        dispatcher: this
                    });
                    this.router.on("routeDidChange", function(route) {
                        this.trigger("routeDidChange", route);
                    }, this);
                }
            },
            writable: true
        },

        /**
         * This method kicks off Backbone's history managment as well as loads the bootstrap data
         * if a reference was passed through the contructors options argument.
         * @method startup
         * @for Application
         */
        startup: {
            value: function() {
                if (this.options.bootstrap) {
                    this.services.get({
                        url: this.options.bootstrap,
                        success: function(response) {
                            this.model.set("bootstrap", response);
                            Backbone.history.start({
                                pushState: false
                            });
                            this.state = Application.States.Started;
                        },
                        error: function(error) {
                            this.error = error;
                            this.state = Application.States.Faulted;
                        }
                    }, this);
                } else {
                    Backbone.history.start({
                        pushState: false
                    });
                    this.state = Application.States.Started;
                }
            }
        }
    });

    Application.extend = extend;

    // =======================================================================
    // === Persistence Model =================================================
    // =======================================================================

    /**
     * The `PeristenceModel` extends the basic [Backbone.Model](http://backbonejs.org/#Model)
     * and overwrites its sync method to take advantage of local storage and persist data
     * across multiple pages within the same domain. The url property is used to grab data
     * from a specific object of the localStorage object. Use the `fetch` method to pull
     * whatever data already exists in localStorage and use the `save` method to store for
     * later use.
     * @class PersistenceModel
     * @extends Backbone.Model
     * @constructor
     * @example
     *	var model = new Backbone.Rebar.PersistenceModel({
     *		url:"custom"
     *	});
     *	model.fetch();
     *	model.set("foo","bar");
     *	model.save();
     */
    var PersistenceModel = Rebar.PersistenceModel = Backbone.Model.extend({

        /**
         * Determains and returns a storage id based on the passed id in initialization
         * @method getStoargeId
         * @return {String} storage id for this persistence model
         * @private
         */
        getStoargeId: function() {
            var id = "pm";
            if (this.urlRoot) {
                // for right now lets just keep this simple
                // @TODO: support ids with urlRoots
                id = id + "_" + this.url().split("/")[0];
            }
            return id;
        },

        /**
         * Overriden to make sure that we have a urlRoot on our persistence model
         * @method set
         * @param {Object} key
         * @param {Object} val
         * @param {Object} options
         */
        set: function(key, val, options) {
            if (key === "url") {
                this.urlRoot = val;
            } else if (_.isObject(key) && _.has(key, "url") && !_.isUndefined(key.url)) {
                this.urlRoot = key.url;
            }
            Backbone.Model.prototype.set.call(this, key, val, options);
        },

        /**
         * Overridden to reroute the to a localStorage endpoint.
         * @method sync
         * @param {String} method
         * @param {PersistenceModel} model
         * @param {Object} options
         * @private
         */
        sync: function(method, model, options) {
            if (method === "read") {
                this.pullLocalStore(model, options);
            } else if (method === "create") {
                localStorage.setItem(model.getStoargeId(), JSON.stringify(_.omit(model.attributes, ["url", "urlRoot"])));
            } else if (method === "update") {
                this.pullLocalStore(model, options);
            } else if (method === "patch") {
                throw "'patch' not implemented yet";
            } else if (method === "delete") {
                throw "'delete' not implemented yet";
            }
        },

        /**
         * Helper method pulls data based on urlRoot from local storage
         * @method pullLocalStore
         * @param {PersistenceModel} model
         * @param {Object} options
         */
        pullLocalStore: function(model, options) {
            if (localStorage) {
                var data = localStorage.getItem(model.getStoargeId());
                if (data !== null) {
                    var parsedData = JSON.parse(data);
                    model.set(parsedData);
                    if (options.success) {
                        options.success(model, parsedData, options);
                    }
                    model.trigger('sync', model, parsedData, options);
                }
            } else {
                var error = "Error: 'localStorage' is not supported";
                if (options.error) {
                    options.error(model, error, options);
                }
                model.trigger('sync', model, error, options);
            }
        }
    });

    // =======================================================================
    // === View ==============================================================
    // =======================================================================

    /**
     * Base class that extends [Backbone.View](http://backbonejs.org/#View) and
     * provides boilerplate plate functionality for transitioning in and out, destroying
     * and rendering views.
     * @class View
     * @constructor
     * @extends Backbone.View
     * @example
     *	var view = new Backbone.Rebar.View({
     *		...
     *	});
     *	view.transitionIn({
     *		...
     *	});
     *	view.transitionOut({
     *		this.destroy();
     *	},this);
     */
    var View = Rebar.View = Backbone.View.extend({

        /**
         * @method initialize
         */
        initialize: function() {
            _.extend(this, _.pick(this.options, ["render", "destroy", "transitionIn", "transitionOut"]));
        },

        /**
         * This method is a great helper method to call when the subclass view is about to be removed.
         * It recursively will call destroy on any subviews reference in the sub views array. It also handles
         * removing any event listeners that may have been added to the subViews array.
         * @method destroy
         */
        destroy: function() {
            if (!this._isDestroyed) {
                this._isDestroyed = true;
                this.trigger("viewDidDestroy", this);
                this.off();
                this.$el.off();
                this.remove();
            }
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
            if (_.isFunction(callback)) {
                callback.call(context ? context : this);
            }
        },

        /**
         * Transitions out the view. By default this method actually does nothing.
         * @method transitionOut
         * @param {Function} callback
         */
        transitionOut: function(callback, context) {
            if (_.isFunction(callback)) {
                callback.call(context ? context : this);
            }
        }
    });

    // =======================================================================
    // === Composite View ====================================================
    // =======================================================================

    /**
     * Most of the time Backbone views need to be able to contain other views. When you do this you run
     * into situations where you need to add the view then render and when you go to destroy the parent 
     * view, you want to make sure you properly dispose of its children. 
     * The composite view makes managing child parent relationships a bit easier by adding recursive destroy
     * functionality as well as making it possible to quickly add and remove child views.
     * @class CompositeView
     * @extends View
     * @constructor
     * @example
     *	var composite = new Backbone.Rebar.CompositeView({
     *		...
     *	});
     *	var view = new Backbone.Rebar.View({
     *		...
     *	});
     *	composite.addSubView(view);
     */
    var CompositeView = Rebar.CompositeView = Backbone.Rebar.View.extend({

        /**
         * Creates an empty array where subview references can be push for later use.
         * @method initialize
         */
        initialize: function() {
            this.subViews = [];
            _.extend(this, _.pick(this.options, ["addSubView", "removeSubView", "removeAllSubViews", "destroy"]));
            View.prototype.initialize.call(this);
        },

        /**
         * Adds a sub view to a container BaseView
         * @method addSubView
         * @param {View} view
         */
        addSubView: function(view) {
            // add event listeners for view
            view.on("viewDidDestroy", function(view) {
                this.removeSubView(view);
            }, this);
            // add sub view 
            this.subViews.push(view);
            // render subview
            var delegate = this;
            view.render(function(el) {
                var markup = el ? el : view.el;
                delegate.$el.append(markup);
            });
            // @TODO - possibly trigger view has been added
        },

        /**
         * Adds an array of sub views to a container BaseView
         * @method addSubViews
         * @param {Array} views Array of subviews
         */
        addSubViews: function(views) {
            _.each(views, function(view) {
                this.addSubView(view);
            }, this);
        },

        /**
         * Removes a sub view from the container view
         * @method removeSubView
         * @param {Object} view A base view or a cid of the sub view
         */
        removeSubView: function(view) {
            // assuming that what was passed was not an actual view and in fact was a cid
            if (!view.cid) {
                view = _.where(this.subViews, {
                    cid: view
                })[0];
            }
            this.destroySubView(view);
            this.subViews = _.reject(this.subViews, function(subView) {
                return subView.cid === view.cid;
            });
        },

        /**
         * Removes all sub views from view
         * @method removeAllSubViews
         */
        removeAllSubViews: function() {
            _.each(this.subViews, function(view) {
                this.removeSubView(view);
            }, this);
        },

        /**
         * This method is a great helper method to call when the subclass view is about to be removed.
         * It recursively will call destroy on any subviews reference in the sub views array. It also handles
         * removing any event listeners that may have been added to the subViews array.
         * @method destroy
         */
        destroy: function() {

            // recursively destroy sub views
            if (this.subViews.length > 0) {
                _.each(this.subViews, function(view) {
                    this.destroySubView(view);
                }, this);
            }

            this.subViews = [];

            View.prototype.destroy.call(this);
        },

        /**
         * Checks to see if the passed view has destroy functionality and then if it does not
         * calls the prototype destroy functionality and passes the reference
         * @method destroySubView
         * @param {View} view
         */
        destroySubView: function(view) {
            if (_.isFunction(view.destroy)) {
                view.destroy(true);
            } else {
                if (!_.isUndefined(view.cid)) {
                    View.prototype.destroy.call(view);
                }
            }
        }
    });

    // =======================================================================
    // === Mediator ==========================================================
    // =======================================================================

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
        if (options) {
            this.options = options;
            _.extend(this, _.pick(this.options, ["initialize", "handle"]));
            if (this.options.events) {
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
                if (eventNames) {
                    events = eventNames.split(" ");
                } else {
                    events = ["all"];
                }
                _.each(events, function(eventName) {
                    view.on(eventName, function(options) {
                        this.handle(eventName, view, options);
                    }, this);
                }, this);
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
                    if (v.cid === view.cid) {
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
                for (var item in events) {
                    var eventObj = events[item];
                    if (_.isObject(eventObj)) {
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
                if (this[callbackName]) {
                    dispatcher.on(eventName, this[callbackName], this);
                } else if (this.options[callbackName]) {
                    dispatcher.on(eventName, this.options[callbackName], this);
                } else {
                    console.error("Error: No method '" + callbackName + "' found on mediator");
                }
            }
        }
    });

    Mediator.extend = extend;

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
    var DependencyRouter = Rebar.DependencyRouter = Backbone.Router.extend({

        /**
         * Default landing for no hash. Where the browser will be routed to when landing
         * on the root url of the applicaiton.
         * @property landing
         * @type {String}
         * @default ""
         */
        landing: "",

        /**
         * Define only the route hash here because we'll be using dependency routing
         * for the rest of the functionality.
         * @property routes
         * @type {Object} route key value pairs
         * @default { "": "handleNoHash", "*splat": "handleAll" }
         * @private
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
         * @private
         */
        staticRoutes: {},

        /**
         * Router init functionality
         * @method initialize
         * @param {Object} options
         * @private
         */
        initialize: function(options) {
            if (!_.isUndefined(options)) {
                if (!_.isUndefined(options.landing)) {
                    this.landing = options.landing;
                }
            }
        },

        /**
         * Reroute the page to the page referenced as landing
         * @method handleNoHash
         * @private
         */
        handleNoHash: function() {
            this.handleAll(this.landing + Backbone.history.location.search);
        },

        /**
         * Handles every route that doesnt match any of the previous matches
         * @method handleAll
         * @private
         */
        handleAll: function(route) {

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
            var router = this;
            var directory = this.getFileLocation(pRoute);

            // now that we're sure that the current route is not one of the static routes set
            // then we'll move forward with the dependency routing functionality
            this.trigger("routeDidChange", pRoute);
            this.pRoute = pRoute;

        },

        /**
         * Parses a passed route string and determains directory, file, view and data
         * @method parseRoute
         * @param {String} route The current Backbone.history fragment
         * @private
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
                directory = "";
                for (var i = 0; i < dirLength; i++) {
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
         * @private
         */
        parseRouteData: function(query) {
            if (_.isUndefined(query)) {
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
         * @private
         */
        getFileLocation: function(route) {
            if (_.isUndefined(route.directory) || route.directory === "") {
                if (_.isUndefined(route.file) || route.file === "") {
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
            for (var route in routes) {
                this.staticRoutes[route] = routes[route];
            }
        }
    });

}).call(this, Backbone, _, $);