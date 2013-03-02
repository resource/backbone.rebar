
// =======================================================================
// === Logger ============================================================
// =======================================================================

/**
 * Logger
 * @class Logger
 */
var Logger = Rebar.Logger = (function() {

	var root = this;
	var _console = typeof(console) !== undefined;
	var _logLevel = 0;

	function log(msg) {
		if (_console && _logLevel >= Logger.Levels.Info) {
			root.console.log(msg);
		}
	}

	function warn(msg) {
		if (_console && _logLevel >= Logger.Levels.Info) {
			root.console.warn(msg);
		}
	}

	function error(msg) {
		if (_console && _logLevel >= Logger.Levels.Error) {
			root.console.error(msg);
		}
	}

	function setLogLevel(logLevel) {
		_logLevel = logLevel;
		return _logLevel;
	}

	return {
		
		/**
		 * console.log wrapper
		 * @method log
		 * @param {Object} msg
		 */
		log: log,

		/**
		 * console.warn wrapper
		 * @method warn
		 * @param {Object} msg
		 */
		warn: warn,

		/**
		 * console.error wrapper
		 * @method error
		 * @param {Object} msg
		 */
		error: error,

		/**
		 * Sets the log level for the logger
		 * @method setLogLevel
		 * @param {Logger.Levels} logLevel
		 */
		setLogLevel: setLogLevel,

		/**
		 * Possible log levels to set the logger to
		 * @property Levels
		 * @static
		 */
		Levels: {
			None: 0,
			Error: 10,
			Info: 20,
			Verbose: 30
		}
	};
}).call(this);
