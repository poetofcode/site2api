const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;
const ProjectMiddleware = require('./projects.js').ProjectMiddleware;
const SnippetMiddleware = require('./snippets.js').SnippetMiddleware;
const createEntityProvider = require('./provider').createEntityProvider;

function initRoutes(router, context) {
	const projectMiddleware = new ProjectMiddleware(context);
	const endpointMiddleware = new EndpointMiddleware(context);
	const snippetMiddleware = new SnippetMiddleware(context);

	router.get('/', projectMiddleware.list());
	router.get('/projects/:projectId', endpointMiddleware.list());
	router.get('/snippets/:snippetId', snippetMiddleware.details());
	router.get('/edit', editGet());
	router.post('/edit', editPost());

	router.use((err, req, res, next) => {
	  if (res.headersSent) {
    	return next(err)
      }
	  console.error(err.stack);
	  res.render('error', { error: err });
	});

}

function editGet() {
	return async(req, res, next) => {
		try {
			// const snippetId = req.params.snippetId;
			// console.log(`snippetId: ${snippetId}`);
			// const snippet = (await this.context.apiGet(`/snippets/${snippetId}`)).data.result;

			const entityType = "project-type";	// TODO брать из query-параметров
			const entityProvider = createEntityProvider(this.context, entityType);

			const body = await entityProvider.provideCreateEntityBody();

			console.log(`Body: ${body}`);

			res.render("entity_edit.hbs", { 
				title: body.title,
				entity : { 
					code: JSON.stringify(body.code, null, 4) 
				}
			});
		} catch(err) {
			next(err);
		}
	}
}

function editPost() {
	return async(req, res, next) => {
		// TODO 
		next(err);
	}
}

exports.initRoutes = initRoutes;