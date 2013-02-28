describe("controller", function() {

	var controller;

	beforeEach(function() {
		controller = new Controller();
	});

	afterEach(function() {});

	it("extend backbone events", function() {
		expect(controller.on).toBeDefined();
	});

});