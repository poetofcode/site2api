class ProjectMiddleware {

	constructor(db) {
		this.db = db;
	}

	list(req, res) {
		res.render("projects.hbs");
	}

	edit(req, res) {

	}

}

exports.ProjectMiddleware = ProjectMiddleware;