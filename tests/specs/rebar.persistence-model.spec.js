describe("persistence-model", function() {

	"use strict";

	var P;
	var p;
	var p2;

	beforeEach(function() {
		P = Backbone.Rebar.PersistenceModel.extend({
			urlRoot: "temp"
		});
		p = new P({
			url: "temp"
		});
		p2 = new Backbone.Rebar.PersistenceModel({
			urlRoot: "temp2",
			//id:"ajlksdhg"
		});
	});
	afterEach(function() {
		localStorage.clear();
	});

	it("initializes", function() {
		expect(p.attributes).toBeDefined();
		expect(p2.attributes).toBeDefined();
	});

	it("extended saves", function() {
		p.set("foo", "bar");
		p.save();
		expect(localStorage[p.getStoargeId()]).toBeDefined();
		var data = JSON.parse(localStorage[p.getStoargeId()]);
		expect(data.foo).toEqual("bar");
	});

	it("extended fetches", function() {
		p.set("foo", "bar");
		p.save();
		p.clear();
		p.fetch();
		expect(p.get('foo')).toEqual("bar");
	});

	it("direct implementation saves", function() {
		p2.set("foo", "bar");
		p2.save();
		expect(localStorage[p2.getStoargeId()]).toBeDefined();
		var data = JSON.parse(localStorage[p2.getStoargeId()]);
		expect(data.foo).toEqual("bar");
	});

	it("!!! direct implementation fetches !!!", function() {
		p2.set("foo", "bar");
		p2.save();
		p2.clear();
		p2.fetch();
		expect(p2.get('foo')).toEqual("bar");
	});

	it("expires content", function() {
		expect(true).toBeTruthy();
	});

	it("multiple fetch and saves works as expected", function() {
		var persistence = new Backbone.Rebar.PersistenceModel();

		persistence.fetch();
		persistence.set("foo", "bar1");
		persistence.save();
		persistence.fetch();
		persistence.set("foo", "bar2");
		persistence.save();

		persistence.fetch();
		persistence.set("bar", "foo1");
		persistence.save();
		persistence.fetch();
		persistence.set("bar", "foo2");
		persistence.save();

		expect(localStorage[persistence.getStoargeId()]).toBeDefined();
		var data = JSON.parse(localStorage[persistence.getStoargeId()]);
		expect(data.foo).toEqual("bar2");
		expect(data.bar).toEqual("foo2");
	});


});