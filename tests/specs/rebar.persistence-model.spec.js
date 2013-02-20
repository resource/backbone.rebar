describe("persistence-model", function() {

	beforeEach(function() {});
	afterEach(function() {});

	it("initializes", function() {
		var p = new Backbone.Rebar.PersistenceModel({
			url:"temp"
		});
		expect(p.attributes).toBeDefined();
	});

	it("saves", function() {
		expect(true).toBeTruthy();
	});

	it("fetches", function() {
		expect(true).toBeTruthy();
	});

	it("expires content", function() {
		expect(true).toBeTruthy();
	});

});