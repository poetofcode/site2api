class EndpointMiddleware {

	constructor(context) {
		this.context = context;
	}

	list() {
		return async(req, res, next) => {
			try {
				const projectId = req.params.projectId;
				const endpoints = (await this.context.apiGet(`/projects/${projectId}/endpoints`)).data.result;
				res.render("endpoints.hbs", { endpoints: endpoints });
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