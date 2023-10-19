class SnippetMiddleware {

	constructor(context) {
		this.context = context;
	}

	details() {
		return async(req, res, next) => {
			try {
				const snippetId = req.params.snippetId;
				console.log(`snippetId: ${snippetId}`);
				
				// const endpoints = (await this.context.apiGet(`/projects/${projectId}/endpoints`)).data.result;
				// const project = (await this.context.apiGet(`/projects/${projectId}`)).data.result;
				res.render("snippet_edit.hbs", { });
			} catch(err) {
				next(err);
			}
		}
	}

	edit(req, res) {
		// TODO
	}

}

exports.SnippetMiddleware = SnippetMiddleware;