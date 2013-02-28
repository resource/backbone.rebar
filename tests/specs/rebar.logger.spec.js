describe("logger", function() {

	beforeEach(function() {});

	afterEach(function() {});

	it("has nessisary", function() {
		expect(Logger.Levels).toBeDefined();
		expect(Logger.log).toBeDefined();
		expect(Logger.warn).toBeDefined();
		expect(Logger.error).toBeDefined();
		expect(Logger.setLogLevel).toBeDefined();
	});

	it("setting log level results in expected log level",function(){
		expect(Logger.setLogLevel(Logger.Levels.Verbose)).toBeDefined(Logger.Levels.Verbose);
	});

});