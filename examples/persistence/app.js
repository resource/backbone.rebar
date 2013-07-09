"use strict";

$(function(){ buildApplication(); });

var persistence;

function buildApplication(){
	persistence = new Backbone.Rebar.PersistenceModel({
		url:"customPM"
	});

	persistence.set("foo","bar");
	persistence.save();
	persistence.fetch();

	// write persistence model to the view
	console.log(persistence);
}