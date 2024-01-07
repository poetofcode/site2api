const ProjectMiddleware = require('./projects.js').ProjectMiddleware;
const SnippetMiddleware = require('./snippets.js').SnippetMiddleware;
const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;
const { utils } = require('../utils');

function initRoutes(router, context) {
	const projectMiddleware = new ProjectMiddleware(context);
	const snippetMiddleware = new SnippetMiddleware(context);
	const endpointMiddleware = new EndpointMiddleware(context);
	
	router.get('/projects', projectMiddleware.fetchProjects());
	router.get('/projects/:id', projectMiddleware.fetchProjectById());
	router.post('/projects', projectMiddleware.createProject());
	router.delete('/projects/:id', projectMiddleware.deleteProjectById());
	router.patch('/projects/:id', projectMiddleware.updateProject());

	router.get('/snippets', snippetMiddleware.fetchSnippets);
	router.get('/snippets/:id', snippetMiddleware.fetchSnippetById());
	router.post('/snippets', snippetMiddleware.createSnippet);
	router.patch('/snippets/:id', snippetMiddleware.updateSnippet());

	router.get('/projects/:projectId/endpoints', endpointMiddleware.fetchEndpoints());
	router.post('/projects/:projectId/endpoints', endpointMiddleware.createEndpoint);
	router.patch('/projects/:projectId/endpoints/:id', endpointMiddleware.updateEndpoint);

	router.use((err, req, res, next) => {
	  if (res.headersSent) {
    	return next(err)
      }
	  console.log(err);
	  res.status(err.status || 500).send(utils.wrapError(err));
	});
}

exports.initRoutes = initRoutes;