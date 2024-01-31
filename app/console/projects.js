class ProjectMiddleware {

	constructor(context) {
		this.context = context;
	}

	list() {
		return async(req, res, next) => {
			try {
				const projects = (await this.context.apiGet('/projects', req.cookies.token)).data.result;
				res.render("projects.hbs", { projects: projects });
			} catch(err) {
				next(err);
			}
		}
	}

	edit() {
		return async(req, res) => {
			// TODO
		}
	}

}

exports.ProjectMiddleware = ProjectMiddleware;