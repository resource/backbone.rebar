/**
 * @class PersistenceModel
 * @extends Backbone.Model
 */
var PersistenceModel = Rebar.PersistenceModel = Backbone.Model.extend({

	/**
	 * Determains and returns a storage id based on the passed id in initialization
	 * @return {String} storage id for this persistence model
	 */
	getStoargeId: function() {
		var id = "pm";
		if(this.url) {
			id = id + "_" + this.url;
		}
		return id;
	},

	/**
	 * @method fetch
	 * @param
	 *
	 */
	sync: function(method, model, options) {
		if(method === "read") {
			if(localStorage) {
				var data = localStorage.getItem(model.getStoargeId());
				if(data !== null) {
					var parsedData = JSON.parse(data);
					model.set(parsedData);
					if(options.success) {
						options.success(model, parsedData, options);
					}
					model.trigger('sync', model, parsedData, options);
				}
			} else {
				var error = "Error: 'localStorage' is not supported";
				if(options.error) {
					options.error(model, error, options);
				}
				model.trigger('sync', model, error, options);
			}
		} else if(method === "create") {
			localStorage.setItem(model.getStoargeId(), JSON.stringify(model.attributes));
		} else if(method === "update") {
			throw "'update' not implemented yet";
		} else if(method === "patch") {
			throw "'patch' not implemented yet";
		} else if(method === "delete") {
			throw "'delete' not implemented yet";
		}
	}


});