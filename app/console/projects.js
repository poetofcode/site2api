class ProjectMiddleware {

	constructor(context) {
		this.context = context;
	}

	list() {
		return async(req, res) => {
			const projects = (await this.context.apiGet('/projects')).data;
			res.render("projects.hbs", { projects: projects });
		}
	}

	edit() {
		return async(req, res) => {
			// TODO
		}
	}

}

exports.ProjectMiddleware = ProjectMiddleware;