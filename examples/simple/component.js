define(["backbone"],function(Backbone){

	return Backbone.Rebar.View.extend({
		className:"component",
		events:{
			"click input[type=radio]":"handleRadioButtonClick"
		},
		render:function(callback){
			this.$el.html(_.template($("#component1-template").html()));
			callback(this.el);
			return this;
		},
		handleRadioButtonClick:function(e){
			this.mediator.handleRadioSelectedWithValue($(e.currentTarget).val());
		}
	});

});