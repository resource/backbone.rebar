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
	if(Application.instance && options && !options._bypassSingleton) {
		return Application.instance;
	}
	if(options && options.logLevel) {
		Logger.setLogLevel(options.logLevel);
	} else {
		Logger.setLogLevel(Logger.Levels.None);
	}
	Application.instance = this;
	this.options = options ? options : {};
	this.state = Application.States.Initialized;

	// setup listener for app shutdown
	$(window).on('beforeunload unload',$.proxy(function(e){
		this.state = Application.States.Shutdown;
	},this));
};

/**
 * Available states for the application used to describe the current state of the applicaiton.
 * @property States
 * @type Object
 * @for Application
 * @final
 */
Application.States = {
	Default:0,
	Initialized:1,
	Faulted:2,
	Started:3,
	Shutdown:4
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
		get: function(){
			return this._state;
		},
		set:function(state){
			if(this._state === state) { return; }
			this._state = state;
			if(this._state === Application.States.Initialized) {
				this.createModel();
				this.createView();
				this.createRouter();
				this.initialize(this.options);
			}
			this.trigger('applicationStateDidChange',this.state);
		}
	},

	/**
	 * Initialization functionality for extended Applicaiton instances.
	 * @method initialize
	 * @for Application
	 */
	initialize:{
		value:function(options){},
		writable:true
	},

	/**
	 * Create a model instance for the Applicaiton instance.
	 * @method createModel
	 * @for Application
	 */
	createModel: {
		value: function() {
			if(!this.model) {
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
			if(!this.view) {
				this.view = new CompositeView({
					el: $('#application')
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
			if(!this.router) {
				this.router = new DependencyRouter({
					landing: this.options.landing ? this.options.landing : '',
					dispatcher:this
				});
				this.router.on('routeDidChange',function(route){
					this.trigger('routeDidChange',route);
				},this);
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
			if(this.options.bootstrap) {
				var delegate = this;
				$.ajax({
					cache: false,
					dataType: 'json',
					type: 'GET',
					url: this.options.bootstrap,
					success: function(response) {
						if(!_.isEmpty(response)) {
							delegate.model.set('bootstrap', response);
							Backbone.history.start({ pushState: false });
							delegate.state = Application.States.Started;
						} else {
							delegate.error = 'Error: Bootstrap load error.';
							delegate.state = Application.States.Faulted;
						}
					},
					error: function(error) {
						delegate.error = error;
						delegate.state = Application.States.Faulted;
					}
				});
			} else {
				Backbone.history.start({ pushState: false });
				this.state = Application.States.Started;
			}
		}
	}
});

Application.extend = extend;