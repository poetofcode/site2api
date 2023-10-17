class EndpointMiddleware {

	constructor(context) {
		this.db = context.getDb();
	}

	list() {
		return async(req, res) => {
			res.render("endpoints.hbs");
		}
	}

	edit(req, res) {

	}

}

exports.EndpointMiddleware = EndpointMiddleware;