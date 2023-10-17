const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;
const ProjectMiddleware = require('./projects.js').ProjectMiddleware;

function initRoutes(router, db) {
	const projectMiddleware = new ProjectMiddleware(db);
	const endpointMiddleware = new EndpointMiddleware(db);
	
	router.get('/', projectMiddleware.list);
	router.get('/endpoints', endpointMiddleware.list);
}

exports.initRoutes = initRoutes;