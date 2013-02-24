describe("application", function() {

	var appConfig = {
		_bypassSingleton: true
	};
	var app;

	beforeEach(function() {
		app = new Application(appConfig);
	});

	afterEach(function() {});

	it("initializes", function() {
		expect(app.model).toBeDefined();
		expect(app.view).toBeDefined();
		expect(app.router).toBeDefined();
	});

	it("extends", function() {
		var C = Application.extend();
		var c = new C(appConfig);
		expect(c.model).toBeDefined();
		expect(c.view).toBeDefined();
		expect(c.router).toBeDefined();
		expect(app.startup).toBeDefined();
	});

	it("extention overwrites", function() {

		var index = 0;

		var C = Application.extend({
			initialize: function() {
				index++;
			},
			createModel: function() {
				index++;
			},
			createView: function() {
				index++;
			},
			createRouter: function() {
				index++;
			}
		});

		var c = new C(appConfig);
		expect(index).toEqual(4);
	});

	it("starts", function() {
		var tempState;
		app.on("applicationStateDidChange", function(state) {
			tempState = state;
		});
		app.startup();
		expect(tempState).toEqual(Application.States.Started);
	});

	it("faults", function() {
		var tempState;
		appConfig.bootstrap = "$@&*";
		app.on("applicationStateDidChange", function(state) {
			tempState = state;
		});
		app.startup();

		waitsFor(function() {
			return app.state === Application.States.Faulted;
		}, "startup to fail", 750);

		runs(function() {
			expect(tempState).toEqual(Application.States.Faulted);
		});

	});

});