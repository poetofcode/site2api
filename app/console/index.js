const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;
const ProjectMiddleware = require('./projects.js').ProjectMiddleware;

function initRoutes(router, context) {
	const projectMiddleware = new ProjectMiddleware(context.getDb());
	const endpointMiddleware = new EndpointMiddleware(context.getDb());
	
	router.get('/', projectMiddleware.list);
	router.get('/endpoints', endpointMiddleware.list);
}

exports.initRoutes = initRoutes;