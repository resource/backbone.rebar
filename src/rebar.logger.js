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
		log: log,
		warn: warn,
		error: error,
		setLogLevel: setLogLevel,
		Levels: {
			None: 0,
			Error: 10,
			Info: 20,
			Verbose: 30
		}
	};
}).call(this);