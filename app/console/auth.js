const cookieParser = require('cookie-parser');

class AuthMiddleware {

	constructor(context) {
		this.context = context;
	}

	loginPage() {
		return async(req, res, next) => {
			try {
				res.render("signin.hbs");
			} catch(err) {
				next(err);
			}
		}
	}

	loginAction(req, res) {
		return async(req, res, next) => {
			try {
	            var response = await this.context.apiPost(`/sessions`, {
	            	name: req.body.username,
	            	password: req.body.password
	            });
	            const result = response.data.result;
	            if (!result) {
	            	return next(new Error('Error auth'));
	            }
				res.cookie('token', result.token);
				res.redirect('/console');

			} catch(err) {
				next(err);
			}
		}
	}

}

exports.AuthMiddleware = AuthMiddleware;