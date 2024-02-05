const { utils } = require('../utils');

class LogdumpMiddleware {

	constructor(context) {
		this.context = context;
	}

	logdumpPage() {
		return async(req, res, next) => {
			try {
				res.render("logdump.hbs", { logDump: '' });
			} catch(err) {
				next(err);
			}
		}
	}

	logdumpRaw() {
		return async(req, res, next) => {
			try {
				const dump = this.prepareDump(global.logDump);
				const result = utils.wrapResult({ result: dump });
				res.send(result);
			} catch(err) {
				next(err);
			}
		}		
	}

	prepareDump(dump) {
		dump = dump.replaceAll('[39m', '</span>');

		// Regular expression to match "[39m" or similar patterns
		var regex = /\[\d+m/g;

		// Replacement format with a placeholder for the number
		var replacement = '<span class="{placeholder}">';

		// Replace all occurrences of the pattern
		var modifiedString = dump.replace(regex, function(match) {
		  // Extract the number from the matched pattern
		  var number = match.match(/\d+/)[0];
		  // Replace the placeholder with the extracted number
		  return replacement.replace('{placeholder}', `colorNum${number}`);
		});

		return modifiedString;
	}

}

exports.LogdumpMiddleware = LogdumpMiddleware;