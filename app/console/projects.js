const repository = require('../repository');

class ProjectMiddleware {

	constructor(context) {
		this.projectRepository = new repository.ProjectRepository(context);
		console.log(repository);
		console.log(this.projectRepository);
	}

	list() {
		return async(req, res) => {
			console.log('Projects ---------------------------');
			console.log(await this.projectRepository.fetchProjectsAll());
			console.log('Projects end -----------------------');
			res.render("projects.hbs", this.projectRepository.fetchProjectsAll());
		}
	}

	edit() {
		return async(req, res) => {
			// TODO
		}
	}

}

exports.ProjectMiddleware = ProjectMiddleware;