/**
 * @class PersistenceModel
 * @extends Backbone.Model
 */
var PersistenceModel = Rebar.PersistenceModel = Backbone.Model.extend({

	/** 
	 * @method initialize
	 * @param {Object} options
	 */
	initialize: function(options) {
		if(localStorage && options && options.pid) {
			this.pid = options.pid;
			var data = localStorage.getItem("pm_" + options.pid);
			if(data !== null) {
				var parseData = JSON.parse(data);
				for(var prop in parseData) {
					Backbone.Model.prototype.set.call(this, prop, parseData[prop], {
						silent: true
					});
				}
			}
		}
	},

	/**
	 * Determains and returns a storage id based on the passed id in initialization
	 * @return {String} storage id for this persistence model
	 */
	getStoargeId: function() {
		var id = "pm";
		if(this.pid) {
			id = id + "_" + this.pid;
		}
		return id;
	},

	/**
	 * This method has been overridden in case any custom functionality is required. The Backbone
	 * Model prototype for this function is called here as well.
	 * @method set
	 * @param {String} key
	 * @param {Object} value
	 * @param {Object} options
	 */
	set: function(key, value, options) {
		// set to local storage
		var temp = {};
		var data = localStorage.getItem(this.getStoargeId());
		if(data !== null) {
			temp = JSON.parse(data);
		}
		temp[key] = value;
		localStorage.setItem(this.getStoargeId(), JSON.stringify(temp));

		// run the default functionality
		return Backbone.Model.prototype.set.call(this, key, value, options);
	},

	/**
	 * This method has been overridden in case any custom functionality is required. The Backbone
	 * Model prototype for this function is called here as well. By default this method works as
	 * Backbone has entended.
	 * @method get
	 * @param {String} attr
	 */
	get: function(attr) {
		return Backbone.Model.prototype.get.call(this, attr);
	},

	/**
	 * unsets from localStorage and model
	 * @method unset
	 * @param {String} attr
	 * @param {Object} options
	 */
	unset: function(attr, options) {
		// remove from localStorage
		var temp = {};
		var data = localStorage.getItem(this.getStoargeId());
		if(data !== null) {
			temp = JSON.parse(data);
			delete temp[attr];
		}
		return Backbone.Model.prototype.unset.call(this, attr, options);
	},

	/**
	 * Clears model and localStorage
	 * @method clear
	 * @param {Object} options
	 */
	clear: function(options) {
		// clear data from localStorage as well
		localStorage.removeItem(this.getStoargeId())
		return Backbone.Model.prototype.clear.call(this, options);
	}


});