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
				// res.render("signin.hbs");

				console.log("Request body:");
				console.log(req.body);

				res.status(500).send('error');

			} catch(err) {
				next(err);
			}
		}
	}

}

exports.AuthMiddleware = AuthMiddleware;