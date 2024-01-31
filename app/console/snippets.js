class SnippetMiddleware {

	constructor(context) {
		this.context = context;
	}

	details() {
		return async(req, res, next) => {
			try {
				const token = req.cookies.token;
				const snippetId = req.params.snippetId;
				const snippet = (await this.context.apiGet(`/snippets/${snippetId}`, token)).data.result;
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