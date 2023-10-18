const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;
const ProjectMiddleware = require('./projects.js').ProjectMiddleware;

function initRoutes(router, context) {
	const projectMiddleware = new ProjectMiddleware(context);
	const endpointMiddleware = new EndpointMiddleware(context);
	
	router.get('/', projectMiddleware.list());
	router.get('/projects/:projectId', endpointMiddleware.list());

	router.use((err, req, res, next) => {
	  if (res.headersSent) {
    	return next(err)
      }
	  console.error(err.stack);
	  res.render('error', { error: err });
	});

}

exports.initRoutes = initRoutes;