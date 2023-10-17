class EndpointMiddleware {

	constructor(db) {
		this.db = db;
	}

	list(req, res) {
		res.render("endpoints.hbs");
	}

	edit(req, res) {

	}

}

exports.EndpointMiddleware = EndpointMiddleware;