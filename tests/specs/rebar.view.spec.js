describe("view", function() {

	var CustomView = Rebar.View.extend({
		render: function(callback) {
			callback("bar");
		}
	});
	var view;

	beforeEach(function() {
		view = new CustomView();
	});

	afterEach(function() {});

	it("instantiates", function() {
		expect(view.cid).toBeDefined();
	});

	it("extends", function() {
		var Custom = Rebar.View.extend({
			foo: "bar",
			transitionIn:function(){
				return "foo" 
			}
		});
		var c = new Custom({
			foo: "foo"
		});
		expect(c.cid).toBeDefined();
		expect(c.transitionIn).toBeDefined();
		expect(c.transitionIn()).toEqual("foo");
		expect(Custom.prototype.foo).toEqual("bar");
		expect(c.options.foo).toEqual("foo");
	});

	it("renders", function() {
		var foo;
		view.render(function(arg) {
			foo = arg;
		});
		expect(foo).toEqual("bar");
	});

	it("can be destroyed", function() {
		var index = 0;
		view.on("foo", function() {
			index++;
		});

		view.trigger("foo");
		expect(index).toEqual(1);

		view.destroy();

		view.trigger("foo");
		expect(index).toEqual(1);
	});

	it("transitions in", function() {
		this.foo = "foo";
		view.transitionIn(function() {
			this.foo = "bar";
		}, this);
		expect(this.foo).toEqual("bar");
	});

	it("transitions out", function() {
		this.foo = "foo";
		view.transitionOut(function() {
			this.foo = "bar";
		}, this);
		expect(this.foo).toEqual("bar");
	});

});