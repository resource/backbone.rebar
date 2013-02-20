$(function(){
	startup();
});

function startup(){

	var CustomModel = Backbone.Rebar.PersistenceModel.extend({
		url:"custom"
	});

	var CustomView = Backbone.View.extend({
		initialize:function(){
			console.log(this);
			this.model.on("change",this.handleModelChange,this);
		},
		handleModelChange:function(data){
			console.log(data.changedAttributes());
		}
	});

	var model = new CustomModel();
	var view = new CustomView({
		model:model
	});

	//model.set("foo","bar");
	//model.save();

}