define(["backbone"],function(Backbone){

	return Backbone.Rebar.View.extend({
		className:"component",
		render:function(callback){
			callback(this.el);
			return this;
		}
	});

});