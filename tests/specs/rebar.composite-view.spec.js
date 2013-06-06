describe("composite-view", function() {

	var Composite;
	var c;

	beforeEach(function() {
		Composite = Backbone.Rebar.CompositeView.extend();
		c = new Composite({
			name: "composite"
		});
	});

	afterEach(function() {

	});

	it("extends view", function() {
		expect(c.destroy).toBeDefined();
		expect(c.transitionIn).toBeDefined();
		expect(c.transitionOut).toBeDefined();
		expect(c.render).toBeDefined();
		expect(c.destroy).toBeDefined();
	});

	it("initializes", function() {
		expect(c.addSubView).toBeDefined();
		expect(c.addSubViews).toBeDefined();
		expect(c.removeSubView).toBeDefined();
		expect(c.removeAllSubViews).toBeDefined();
	});

	it("can add subview", function() {
		var v = new Backbone.Rebar.View();
		c.addSubView(v);
		expect(c.subViews.length).toEqual(1);
	});

	it("can add subviews", function() {
		var v1 = new Backbone.Rebar.View();
		var v2 = new Backbone.Rebar.View();
		c.addSubViews([v1, v2]);
		expect(c.subViews.length).toEqual(2);
	});

	it("can add non rebar views", function() {
		var v = new Backbone.View();
		c.addSubView(v);
		expect(c.subViews.length).toEqual(1);
	});

	it("can remove non rebar subviews", function() {
		var v = new Backbone.View();
		c.addSubView(v);
		c.removeSubView(v);
		expect(c.subViews.length).toEqual(0);
	});

	it("can remove subview", function() {
		var v = new Backbone.Rebar.View();
		c.addSubView(v);
		c.removeSubView(v);
		expect(c.subViews.length).toEqual(0);
	});

	it("can remove subview with cid", function() {
		var v = new Backbone.Rebar.View();
		c.addSubView(v);
		c.removeSubView(v.cid);
		expect(c.subViews.length).toEqual(0);
	});

	it("can remove all subviews", function() {
		var v1 = new Backbone.Rebar.View({
			name: "v1"
		});
		var v2 = new Backbone.Rebar.View({
			name: "v2"
		});
		var v3 = new Backbone.View({
			name: "v3"
		});
		c.addSubViews([v1, v2, v3]);
		c.removeAllSubViews();
		expect(c.subViews.length).toEqual(0);
	});

	it("destroys subviews when destroyed", function() {
		var v1 = new Backbone.Rebar.View({
			name: "v1"
		});
		var v2 = new Backbone.Rebar.View({
			name: "v2"
		});
		var v3 = new Backbone.View({
			name: "v3"
		});
		c.addSubViews([v1, v2, v3]);
		c.destroy();
		expect(c.subViews.length).toEqual(0);
	});

	it("destroys nested subviews when destroyed", function() {
		var v1 = new Backbone.Rebar.View({
			name: "v1"
		});
		var v2 = new Backbone.Rebar.CompositeView({
			name: "v2"
		});
		var v2a = new Backbone.Rebar.View({
			name: "v2a"
		});
		var v2b = new Backbone.Rebar.View({
			name: "v2b"
		});
		v2.addSubViews([v2a, v2b]);
		var v3 = new Backbone.View({
			name: "v3"
		});
		c.addSubViews([v1, v2, v3]);
		c.destroy();
		expect(c.subViews.length).toEqual(0);
	});

	it("subview can only be destroyed once", function() {
		var tick = 0;
		var V = Backbone.Rebar.View.extend({
			destroy:function(){
				tick++;
				Backbone.Rebar.View.prototype.destroy.call(this);
			}
		});
		var v1 = new V({ name:"v1" });
		c.addSubViews([v1]);
		c.destroy();
		expect(tick).toEqual(1);
	});

});