class EndpointMiddleware {

	constructor(context) {
		this.context = context;
	}

	list() {
		return async(req, res, next) => {
			try {
				const token = req.cookies.token;
				const projectId = req.params.projectId;
				const endpoints = (await this.context.apiGet(`/projects/${projectId}/endpoints`, token)).data.result;
				const project = (await this.context.apiGet(`/projects/${projectId}`, token)).data.result;
				res.render("endpoints.hbs", { endpoints: endpoints, project: project });
			} catch(err) {
				next(err);
			}
		}
	}

	edit(req, res) {
		// TODO
	}

}

exports.EndpointMiddleware = EndpointMiddleware;