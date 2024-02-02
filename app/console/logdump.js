// const cookieParser = require('cookie-parser');

class LogdumpMiddleware {

	constructor(context) {
		this.context = context;
	}

	logdumpPage() {
		return async(req, res, next) => {
			try {
				res.render("signin.hbs");
			} catch(err) {
				next(err);
			}
		}
	}

}

exports.LogdumpMiddleware = LogdumpMiddleware;