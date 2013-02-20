/**
 * Static class with boilerplate functionality for jquery ajax requests
 * @class Services
 * @static
 */
var Services = Rebar.Services = {

    /**
     * jQuery wrapper for ajax() calls
     * @method request
     * @param {Object} options
     * @param {Object} context
     * @private
     * @for Services
     */
    request: function(type, options, context) {

        // options
        var opts = this.parseOptions(options);
        var id = opts.id;
        var error = opts.error;
        var success = opts.success;
        var data = opts.data;
        var delegate = this;
        var url = opts.url;

        // create ajax object
        var o = {};

        // set the url passed
        o.url = opts.url ? opts.url : (opts.id ? this.getServiceEndpointById(id) : undefined);

        // set the data passed
        if(!_.isUndefined(data)) {
            o.data = data;
        }

        // set the success funx
        o.success = function(response) {
            if(!_.isEmpty(response)) {
                delegate.handleSuccess(context, success, response);
            } else {
                delegate.handleError(context);
            }
        };

        // set the error funx
        o.error = function(e) {
            delegate.handleError(context, error, e);
        };

        o.cache = false;
        o.dataType = 'json';
        o.type = type;

        // call ajax
        $.ajax(o);

    },

    /**
     * Parses the incoming options object to the http method and returns
     * a useable options object for the request
     * @method parseOptions
     * @param {Object} options
     * @private
     * @for Services
     */
    parseOptions: function(options) {
        return {
            id: options.id ? options.id : undefined,
            error: options.error ? options.error : function() {},
            success: options.success ? options.success : function() {},
            data: options.data ? options.data : undefined,
            url: options.url ? options.url : undefined
        };
    },

    /**
     * Processes the error object returned by the http request
     * @method parseError
     * @param {Object} error
     * @private
     * @for Services
     */
    parseError: function(error) {
        var temp = {};
        if(_.isUndefined(error) || _.isEmpty(error) || _.isNull(error)) {
            temp.code = 204;
            temp.message = "No Content";
        } else {
            temp.code = error.status;
            temp.message = error.statusText;
        }
        temp.originalError = error;
        return temp;
    },

    /**
     * jquery success handler
     * @method handleSuccess
     * @param {Object} context
     * @param {Function} callback
     * @param {Object} response
     * @private
     * @for Services
     */
    handleSuccess: function(context, callback, response) {
        callback.call(context, response);
    },

    /**
     * jquery ajax error handler
     * @method handleError
     * @param {Object} context
     * @param {Function} callback
     * @param {Object} response
     * @private
     * @for Services
     */
    handleError: function(context, callback, response) {
        callback.call(context, this.parseError(response));
    },

    /**
     * GET request
     * @method get
     * @param {Object} options
     * @param {Object} context
     * @for Services
     */
    get: function(options, context) {
        this.request("GET", options, context);
    },

    /**
     * POST request
     * @method post
     * @param {Object} options
     * @param {Object} context
     * @for Services
     */
    post: function(options, context) {
        this.request("POST", options, context);
    },

    /**
     * PUT request
     * @method put
     * @param {Object} options
     * @param {Object} context
     * @for Services
     */
    put: function(options, context) {
        this.request("PUT", options, context);
    },

    /**
     * DELETE request
     * @method delete
     * @param {Object} options
     * @param {Object} context
     * @for Services
     */
    delete: function(options, context) {
        this.request("DELETE", options, context);
    }
};