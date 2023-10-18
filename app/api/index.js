const ProjectMiddleware = require('./projects.js').ProjectMiddleware;
const SnippetMiddleware = require('./snippets.js').SnippetMiddleware;
const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;

function initRoutes(router, context) {
	const projectMiddleware = new ProjectMiddleware(context);
	const snippetMiddleware = new SnippetMiddleware(context);
	const endpointMiddleware = new EndpointMiddleware(context);
	
	router.get('/projects', projectMiddleware.fetchProjects());
	router.post('/projects', projectMiddleware.createProject);
	router.get('/snippets', snippetMiddleware.fetchSnippets);
	router.post('/snippets', snippetMiddleware.createSnippet);
	router.patch('/snippets/:id', snippetMiddleware.updateSnippet);
	router.get('/projects/:projectId/endpoints', endpointMiddleware.fetchEndpoints);
	router.post('/projects/:projectId/endpoints', endpointMiddleware.createEndpoint);
	router.patch('/projects/:projectId/endpoints/:id', endpointMiddleware.updateEndpoint);
}

exports.initRoutes = initRoutes;