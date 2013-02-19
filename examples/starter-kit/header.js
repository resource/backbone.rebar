define(["rebar"],function(){
	return Backbone.Rebar.CompositeView.extend({
		render:function(){
			this.$el.html("<p>Header</p>");
		}
	});
});