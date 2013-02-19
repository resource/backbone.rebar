define(["rebar"],function(){
	return Backbone.Rebar.CompositeView.extend({
		render:function(){
			this.$el.append("<p>Footer</p>")
		}
	});
});