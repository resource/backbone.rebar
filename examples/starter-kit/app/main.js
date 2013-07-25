'use strict';
/**
 * This is the main entry point into the application. It takes care of setting up the
 * application ns, creates any global elements and kicks off the router.
 **/
require([
	"jquery",
	"rebar",
	"modules/header",
	"modules/content",
	"modules/footer"
],
function(
	$,
	Rebar,
	HeaderView,
	ContentModule,
	FooterView
) {
	var application;

	/**
	 * Create a new Rebar application and set the default landing subview to View1.
	 */
	var createApplication = function() {
		application = new Backbone.Rebar.Application({
			landing: "View1",
			viewOptions:{
				transitionIn:function(callback,context){
					console.log(this.$el);
					this.$el.fadeTo(200, 1);
					Rebar.View.prototype.transitionIn.call(context,callback);
					window.scroll(0,1);
				}
			}
		});
		createViews();
	};

	/**
	 * A main view, header and footer views are all created here.
	 */
	var createViews = function() {
		var content = new ContentModule.ContentView({
			el: $("#main")
		});
		var header = new HeaderView({
			el: $("#header")
		});
		var footer = new FooterView({
			el: $("#footer")
		});

		/**
		 * Set up a mediator to talk to allow the content to send messages to the
		 * header view. This enables functionality like setting an active class
		 * on the menu and changing the subtitle.
		 */
		var mediator = new Rebar.Mediator({
			view: content,
			viewEvents: "headerEvent",
			handle: function(eventName, view, data){
				// set the subtitle
				if (!_.isUndefined(data.subtitle)) {
					$("#header").find("span").html(data.subtitle);
				}
				// set the active subview menu item
				if (!_.isUndefined(data.active)) {
					$("#header").find(".view").removeClass("active");
					$("#header").find("."+data.active).addClass("active");
				}
				// show or hide header
				if (data.headfoot) {
					$("#footer").show();
				} else {
					$("#footer").hide();
				}
			}
		});

		application.view.addSubViews([content, header, footer]);
		startApplication();
	};

	/**
	 * Start up the Backbone application and run the main transitionIn function.
	 */
	var startApplication = function() {
		application.on("applicationStateDidChange", function(state, error) {
			if (state === Rebar.Application.States.Started) {
				console.log('started');
			} else if (state === Rebar.Application.States.Faulted) {
				console.log(error);
			}
		}, this);
		application.startup();
		application.view.transitionIn();
	};

	/**
	 * Treat the jQuery ready function as the entry point to the application.
	 * Inside this function, kick-off all initialization, everything up to this
	 * point should be definitionamespace.
	 */
	$(function() {
		createApplication();
	});

});