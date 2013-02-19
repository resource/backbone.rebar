/**
 * @class Application
 */
var Application = Rebar.Application = function(options) {

	// singleton functionality
	if(Application.instance) {
		return Application.instance;
	}
	Application.instance = this;

	// apply
	this.options = options;

	// create out application controller
	this.controller = new Controller();

	var dr = this.options.dependencyRouting;
	if(_.isUndefined(dr) || (_.isBoolean(dr) && dr)) {
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
			if(this.options.bootstrap) {
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
			if(_.isFunction(callback)) {
				if(context) {
					callback.call(context);
				} else {
					callback();
				}
			}
		}
	}
});