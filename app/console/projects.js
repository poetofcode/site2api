const repository = require('../repository');

class ProjectMiddleware {

	constructor(context) {
		this.projectRepository = new repository.ProjectRepository(context);
		console.log(repository);
		console.log(this.projectRepository);
	}

	list() {
		return async(req, res) => {
			const projects = await this.projectRepository.fetchProjectsAll();
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