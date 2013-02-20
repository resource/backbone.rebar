describe("core",function(){
	
	beforeEach(function(){});
	afterEach(function(){});

	it("extends",function(){
		
		var A = function(){ this.bar = "foo"; };
		A.prototype = {"foo":"bar"};
		A.extend = extend;
		var B = A.extend({ tick:"tack" });
		var b = new B();
		
		expect(b.foo).toEqual("bar");
		expect(b.bar).toEqual("foo");
		expect(B.prototype.tick).toEqual("tack");

	});
	
});