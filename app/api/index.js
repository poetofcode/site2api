const ProjectMiddleware = require('./projects.js').ProjectMiddleware;
const SnippetMiddleware = require('./snippets.js').SnippetMiddleware;
const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;
const SessionMiddleware = require('./sessions.js').SessionMiddleware;
const repository = require('../repository');
const { utils } = require('../utils');

function initRoutes(router, context) {
	const projectMiddleware = new ProjectMiddleware(context);
	const snippetMiddleware = new SnippetMiddleware(context);
	const endpointMiddleware = new EndpointMiddleware(context);
	const sessionMiddleware = new SessionMiddleware(context);

	const sessionRepository = new repository.SessionRepository(context);

	router.use(async function (req, res, next) {
		const authHeader = req.header('Authorization');

		// White-list эндпоинтов без авторизации:
		const isSessionsPost = req.path === '/sessions' && req.method === 'POST';
		const isSessionByTokenGet = req.path.startsWith("/sessions/") && req.path !== "/sessions/" && req.method === 'GET';
		const isSessionByTokenDelete = req.path.startsWith("/sessions/") && req.path !== "/sessions/" && req.method === 'DELETE';
		if (isSessionsPost || isSessionByTokenGet || isSessionByTokenDelete) {
			return next();
		}

		if (authHeader) {
			const token = authHeader.replace('Bearer ', '');
            const session = await sessionRepository.fetchSessionByToken(token);
            if (session) {
            	return next();
            }
		}

		res.status(400).send(utils.wrapError(new Error('Not authorized')));
	});

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
	router.post('/projects/:projectId/endpoints', endpointMiddleware.createEndpoint());
	router.patch('/projects/:projectId/endpoints/:id', endpointMiddleware.updateEndpoint());
	router.delete('/endpoints/:id', endpointMiddleware.deleteEndpoint());
	router.get('/endpoints/:id', endpointMiddleware.fetchEndpointById());

	router.post('/sessions', sessionMiddleware.createSession());
	router.get('/sessions', sessionMiddleware.fetchSessions());
	router.get('/sessions/:token', sessionMiddleware.fetchSessionByToken());
	router.delete('/sessions/:token', sessionMiddleware.deleteSessionByToken());

	router.use((err, req, res, next) => {
	  if (res.headersSent) {
    	return next(err)
      }
	  console.log(err);
	  res.status(err.status || 500).send(utils.wrapError(err));
	});
}

exports.initRoutes = initRoutes;