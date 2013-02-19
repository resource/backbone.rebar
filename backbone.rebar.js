(function(Backbone, _, $) {

    "use strict";

    // var root = this;
    // var Rebar = root.Rebar = Backbone.Rebar = {};
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

    var Services = Rebar.Services = {

        /**
         * We're storing these here because for some reason json files are cached
         * on the phonegap device implementations
         * @method getServices
         */
        getServices: function() {
            return [{
                id: "bootstrap",
                endpoint: "assets/data/bootstrap_data.json"
            }];
        },

        /**
         * Returns the url for the passed service id
         * @method getServiceEndpointById
         */
        getServiceEndpointById: function(id) {

            var endpoint;

            // find the service endpoint
            _.each(this.getServices(), function(service) {
                if (service.id === id) {
                    endpoint = "/" + service.endpoint;
                }
            });

            // if nothing gets caught
            return endpoint;

        },

        /**
         * jQuery wrapper for ajax() calls
         * @method request
         * @param {Object} options
         * @param {Object} context
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
         */
        handleError: function(context, callback, response) {
            callback.call(context, this.parseError(response));
        },

        /**
         * GET request
         * @method get
         * @param {Object} options
         * @param {Object} context
         */
        get: function(options, context) {
            this.request("GET", options, context);
        },

        /**
         * POST request
         * @method post
         * @param {Object} options
         * @param {Object} context
         */
        post: function(options, context) {
            this.request("POST", options, context);
        },

        /**
         * PUT request
         * @method put
         * @param {Object} options
         * @param {Object} context
         */
        put: function(options, context) {
            this.request("PUT", options, context);
        },

        /**
         * DELETE request
         * @method delete
         * @param {Object} options
         * @param {Object} context
         */
        delete: function(options, context) {
            this.request("DELETE", options, context);
        }
    };

    // =======================================================================
    // === Application =======================================================
    // =======================================================================

    /**
     * @class Application
     */
    var Application = Rebar.Application = function(options) {

        // singleton functionality
        if (Application.instance) {
            return Application.instance;
        }
        Application.instance = this;

        // apply
        this.options = options;

        // create out application controller
        this.controller = new Controller();

        var dr = this.options.dependencyRouting;
        if (_.isUndefined(dr) || (_.isBoolean(dr) && dr)) {
            // create our global dependecy router
            this.router = new DependencyRouter({
                landing: options.landing ? options.landing : "",
                controller: this.controller
            });
        }

        // create out application model as a persistence model
        this.model = new PersistenceModel();

        // create our view that all other views within the application will live
        this.view = new CompositeView({
            el: $("#application")
        });
    };

    Application.prototype = Object.create({}, {

        /**
         *
         * @property controller
         * @type Rebar.Controller
         * @for Application
         */
        controller: {
            value: undefined,
            writable: true
        },

        /**
         *
         * @property model
         * @type Backbone.Model
         * @for Application
         */
        model: {
            value: undefined,
            writable: true
        },

        /**
         *
         * @property view
         * @type Rebar.CompositeView
         * @for Application
         */
        view: {
            value: undefined,
            writable: true
        },

        /**
         *
         * @property router
         * @type Backbone.Router
         * @for Application
         */
        router: {
            value: undefined,
            writable: true
        },

        services: {
            value: _.clone(Services),
            writable: false
        },

        /**
         *
         * @method start
         * @type Rebar.Controller
         * @for Application
         */
        start: {
            value: function(callback, context) {
                if (this.options.bootstrap) {
                    this.services.get({
                        url: this.options.bootstrap,
                        success: function(response) {
                            this.model.set("bootstrap", response);
                            this.build(callback, context);
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    }, this);
                } else {
                    this.build(callback, context);
                }
            }
        },

        /**
         *
         * @method build
         * @type Rebar.Controller
         * @for Application
         */
        build: {
            value: function(callback, context) {

                // start Backbone.history
                Backbone.history.start({
                    pushState: false
                });

                // throw callback
                if (_.isFunction(callback)) {
                    if (context) {
                        callback.call(context);
                    } else {
                        callback();
                    }
                }
            }
        }
    });

    // =======================================================================
    // === Persistence Model =================================================
    // =======================================================================

    /**
     * @class PersistenceModel
     * @extends Backbone.Model
     */
    var PersistenceModel = Rebar.PersistenceModel = Backbone.Model.extend({

        /** 
         * @method initialize
         * @param {Object} options
         */
        initialize: function(options) {
            if (localStorage && options && options.pid) {
                this.pid = options.pid;
                var data = localStorage.getItem("pm_" + options.pid);
                if (data !== null) {
                    var parseData = JSON.parse(data);
                    for (var prop in parseData) {
                        Backbone.Model.prototype.set.call(this, prop, parseData[prop], {
                            silent: true
                        });
                    }
                }
            }
        },

        /**
         * This method has been overridden in case any custom functionality is required. The Backbone
         * Model prototype for this function is called here as well. By default this method works as
         * Backbone has entended.
         * @method set
         * @param {String} key
         * @param {Object} value
         * @param {Object} options
         */
        set: function(key, value, options) {

            // check to make sure we have a pid
            if (this.pid) {
                // set to local storage
                var temp = {};
                var data = localStorage.getItem("pm_" + this.pid);
                if (data !== null) {
                    temp = JSON.parse(data);
                }
                temp[key] = value;
                localStorage.setItem("pm_" + this.pid, JSON.stringify(temp));
            }

            // run the default functionality
            return Backbone.Model.prototype.set.call(this, key, value, options);
        },

        /**
         * This method has been overridden in case any custom functionality is required. The Backbone
         * Model prototype for this function is called here as well. By default this method works as
         * Backbone has entended.
         * @method get
         * @param {String} attr
         */
        get: function(attr) {
            return Backbone.Model.prototype.get.call(this, attr);
        },

        /**
         *
         */
        unset: function(attr, options) {
            // remove from localstorage
            return Backbone.Model.prototype.unset.call(this, attr, options);
        },

        clear: function(options) {
            // clear data from localStorage as well
            return Backbone.Model.prototype.clear.call(this, options);
        }


    });

    // =======================================================================
    // === Mediator ==========================================================
    // =======================================================================

    /**
     * @class Mediator
     * @uses extend
     */
    var Mediator = Rebar.Mediator = function() {};
    Mediator.prototype = {};
    Mediator.extend = extend;

    // =======================================================================
    // === View ==============================================================
    // =======================================================================

    /**
     * @class View
     * @extends Backbone.View
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
        destroy: function(force) {
            this.off();
            this.$el.off();
            this.remove();
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
     * @class CompositeView
     * @extends View
     */
    var CompositeView = Rebar.CompositeView = Backbone.Rebar.View.extend({

        /**
         * Creates an empty array where subview references can be push for later use.
         * @method initialize
         */
        initialize: function() {
            this.subViews = [];
            _.extend(this, _.pick(this.options, ["addSubView", "removeSubView", "destroy"]));
            View.prototype.initialize.call(this);
        },

        /**
         * Adds a sub view to a container BaseView
         * @method addSubView
         * @param {BaseView} view
         */
        addSubView: function(view) {
            if (!_.isFunction(view.destroy)) {
                console.log("could not add view because it does not extend Rebar.View");
                return;
            }
            // only add views that extend Backbone.BaseView (our extention of the framework)
            this.subViews.push(view);
            view.parent = this;
            var delegate = this;
            view.render(function(el) {
                delegate.$el.append(el);
            });
        },

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
                });
            }
            view.destroy(true);
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
        destroy: function(force) {

            if (!_.isUndefined(this.parent) && !_.isBoolean(force)) {
                this.parent.removeSubView(this);
                return false;
            }

            // recursively destroy sub views
            if (this.subViews.length > 0) {
                _.each(this.subViews, function(view) {
                    view.destroy();
                });
            }

            this.subViews = [];

            View.prototype.destroy.call(this);
        }
    });

    // =======================================================================
    // === Controller ========================================================
    // =======================================================================

    /**
     * @class Controller
     * @extends Backbone.Events
     * @uses extend
     */
    var Controller = Rebar.Controller = function() {};

    Controller.prototype = Object.create(Backbone.Events);

    Controller.extend = extend;

    // =======================================================================
    // === Dependency Router =================================================
    // =======================================================================

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
            if (!_.isUndefined(options)) {
                if (!_.isUndefined(options.landing)) {
                    this.landing = options.landing;
                }
                if (!_.isUndefined(options.controller)) {
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
            this.controller.trigger("routeDidChange", pRoute);
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

}).call(this, Backbone, _, $);