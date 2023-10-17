const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;
const ProjectMiddleware = require('./projects.js').ProjectMiddleware;

function initRoutes(router, context) {
	const projectMiddleware = new ProjectMiddleware(context);
	const endpointMiddleware = new EndpointMiddleware(context);
	
	router.get('/', projectMiddleware.list());
	router.get('/endpoints', endpointMiddleware.list());
}

exports.initRoutes = initRoutes;