const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;
const ProjectMiddleware = require('./projects.js').ProjectMiddleware;
const SnippetMiddleware = require('./snippets.js').SnippetMiddleware;

function initRoutes(router, context) {
	const projectMiddleware = new ProjectMiddleware(context);
	const endpointMiddleware = new EndpointMiddleware(context);
	const snippetMiddleware = new SnippetMiddleware(context);

	router.get('/', projectMiddleware.list());
	router.get('/projects/:projectId', endpointMiddleware.list());
	router.get('/snippets/:snippetId', snippetMiddleware.details());

	router.use((err, req, res, next) => {
	  if (res.headersSent) {
    	return next(err)
      }
	  console.error(err.stack);
	  res.render('error', { error: err });
	});

}

exports.initRoutes = initRoutes;