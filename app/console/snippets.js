class SnippetMiddleware {

	constructor(context) {
		this.context = context;
	}

	details() {
		return async(req, res, next) => {
			try {
				const snippetId = req.params.snippetId;
				console.log(`snippetId: ${snippetId}`);
				const snippet = (await this.context.apiGet(`/snippets/${snippetId}`)).data.result;
				res.render("snippet_edit.hbs", { snippet : snippet });
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