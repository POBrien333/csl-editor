"use strict";

define(function () {
	var log, time, timeEnd;

	// TODO: Probably best to change to use console.log(), console.time() and console.timeEnd()
	//       throughout code instead of debug.log(), etc...
	//       Reason: Using console.log() will show the original line number where it was called
	//       from in the Chrome console instead of the line number here in debug.js.
	if (typeof(console) === "undefined" && typeof(window) !== "undefined") {
		log = function () {};
		time = function () {};
		timeEnd = function () {};
	} else {
		log = function (message) { console.log(message); };
		time = function (message) { console.time(message); };
		timeEnd = function (message) { console.timeEnd(message); };
	}

	var assertEqual = function (actual, expected, place) {
		if (actual !== expected) {
			try {
				throw new Error("Assert fail: " + actual + " !== " + expected);
			} catch (err) {
				// put stack trace message in JSON - hack to access from window.onerror
				err.message = err.stack;
				throw err;
			}
		}
	};

	var assert = function (assertion, place) {
		var err;
		if (!assertion) {
			try {
				throw new Error("Assert fail");
			} catch (err) {
				// put stack trace message in JSON - hack to access from window.onerror
				err.message = err.stack;
				throw err;
			}
		}
	};

	// puts a module in global window object, handy for debugging
	if (typeof(window) !== "undefined") {
		window.CSLEDIT_expose = function (moduleName, varName) {
			varName = varName || 'CSLEDIT_' + moduleName;
			require(['src/' + moduleName], function (module) {
				window[varName] = module;
			});
		};
	}

	return {
		assert : assert,
		assertEqual : assertEqual,
		log : log,
		time : time,
		timeEnd : timeEnd
	};
});
