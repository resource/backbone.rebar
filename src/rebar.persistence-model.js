// =======================================================================
// === Persistence Model =================================================
// =======================================================================

/**
 * The `PeristenceModel` extends the basic [Backbone.Model](http://backbonejs.org/#Model)
 * and overwrites its sync method to take advantage of local storage and persist data
 * across multiple pages within the same domain. The url property is used to grab data
 * from a specific object of the localStorage object. Use the `fetch` method to pull
 * whatever data already exists in localStorage and use the `save` method to store for
 * later use.
 * @class PersistenceModel
 * @extends Backbone.Model
 * @constructor
 * @example
 *	var model = new Backbone.Rebar.PersistenceModel({
 *		url:"custom"
 *	});
 *	model.fetch();
 *	model.set("foo","bar");
 *	model.save();
 */
var PersistenceModel = Rebar.PersistenceModel = Backbone.Model.extend({

	/**
	 * Determains and returns a storage id based on the passed id in initialization
	 * @method getStoargeId
	 * @return {String} storage id for this persistence model
	 * @private
	 */
	getStoargeId: function() {
		var id = 'pm';
		if (this.urlRoot) {
			// for right now lets just keep this simple
			// @TODO: support ids with urlRoots
			id = id + '_' + this.url().split('/')[0];
		}
		return id;
	},

	/**
	 * Overriden to make sure that we have a urlRoot on our persistence model
	 * @method set
	 * @param {Object} key
	 * @param {Object} val
	 * @param {Object} options
	 */
	set: function(key, val, options) {
		if (key === 'url') {
			this.urlRoot = val;
		} else if (_.isObject(key) && _.has(key, 'url') && !_.isUndefined(key.url)) {
			this.urlRoot = key.url;
		}
		Backbone.Model.prototype.set.call(this, key, val, options);
	},

	/**
	 * Overridden to reroute the to a localStorage endpoint.
	 * @method sync
	 * @param {String} method
	 * @param {PersistenceModel} model
	 * @param {Object} options
	 * @private
	 */
	sync: function(method, model, options) {
		if (method === 'read') {
			this.pullLocalStore(model, options);
		} else if (method === 'create') {
			localStorage.setItem(model.getStoargeId(), JSON.stringify(_.omit(model.attributes, ['url', 'urlRoot'])));
		} else if (method === 'update') {
			this.pullLocalStore(model, options);
		} else if (method === 'patch') {
			throw '\'patch\' not implemented yet';
		} else if (method === 'delete') {
			throw '\'delete\' not implemented yet';
		}
	},

	/**
	 * Helper method pulls data based on urlRoot from local storage
	 * @method pullLocalStore
	 * @param {PersistenceModel} model
	 * @param {Object} options
	 * @private
	 */
	pullLocalStore: function(model, options) {
		if (localStorage) {
			var data = localStorage.getItem(model.getStoargeId());
			if (data !== null) {
				var parsedData = JSON.parse(data);
				model.set(parsedData);
				if (options.success) {
					options.success(model, parsedData, options);
				}
				model.trigger('sync', model, parsedData, options);
			}
		} else {
			var error = 'Error: \'localStorage\' is not supported';
			if (options.error) {
				options.error(model, error, options);
			}
			model.trigger('sync', model, error, options);
		}
	},

	/**
	 * Backone model save functionality
	 * @param {Object} key
	 * @param {Object} val
	 * @param {Object} options
	 */
	save: function(key, val, options) {
		try {
			Backbone.Model.prototype.save.call(this, key, val, options);
		} catch (e) {
			console.log("@TODO: look into why this is throwing an error");
			console.log(e);
		}
	}
});