$(function(){ buildApplication(); });

var persistence;

function buildApplication(){
	persistence = new Backbone.Rebar.PersistenceModel({
		url:"custom"
	});
	persistence.fetch();
	console.log(persistence);
}