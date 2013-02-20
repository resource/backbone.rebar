describe("services", function() {

	var services;

	beforeEach(function() {
		services = Backbone.Rebar.Services;
	});

	afterEach(function() {});

	it("is what it is", function() {
		expect(true).toBeTruthy();
	});

	it("options should return expected object", function() {

		var options = {};
		var parsed = services.parseOptions(options);

		expect(parsed).toBeDefined();
		expect(parsed.id).not.toBeDefined();
		expect(_.isFunction(parsed.error)).toEqual(true);
		expect(_.isFunction(parsed.success)).toEqual(true);
		expect(parsed.data).not.toBeDefined();

		var options = {
			id: "id",
			error: function() {
				return "error";
			},
			success: function() {
				return "success";
			},
			data: {
				test: "test"
			}
		};
		var parsed = services.parseOptions(options);

		expect(parsed).toBeDefined();
		expect(parsed.id).toEqual("id");
		expect(parsed.error()).toEqual("error");
		expect(parsed.success()).toEqual("success");
		expect(parsed.data.test).toBeDefined();

	});

	it("on error should return formatted error", function() {

		var error = {
			status: 404,
			statusText: "error"
		};
		var response = services.parseError(error);

		expect(response).toBeDefined();
		expect(response.code).toEqual(404);
		expect(response.message).toEqual("error");

	});

	it("requests that returns empty should return formatted error", function() {

		var response = services.parseError();

		expect(response).toBeDefined();
		expect(response.code).toEqual(204);
		expect(response.message).toEqual("No Content");

	});

});