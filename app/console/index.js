const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;
const ProjectMiddleware = require('./projects.js').ProjectMiddleware;
const SnippetMiddleware = require('./snippets.js').SnippetMiddleware;
const createEntityProvider = require('./provider').createEntityProvider;

function initRoutes(router, context) {
	const projectMiddleware = new ProjectMiddleware(context);
	const endpointMiddleware = new EndpointMiddleware(context);
	const snippetMiddleware = new SnippetMiddleware(context);

	// Коммент по устройству админки:
	// 	методы на просмотр сущностей (проектов, эндпоинтов) сделаны в виде просто обычных HTML-форм,
	//	а вот редактирование сделал с помощью редактора кода. Поэтому их не нужно искать в ./projects.js, ./endpoints.js и т.д.
	//  Они идут чуть ниже по коду... 
	router.get('/', projectMiddleware.list());
	router.get('/projects/:projectId', endpointMiddleware.list());
	router.get('/snippets/:snippetId', snippetMiddleware.details());
	
	// ...вот методы на редактирование сущностей
	router.get('/edit', editGet(context));
	router.post('/edit', editPost(context));

	router.use((err, req, res, next) => {
	  if (res.headersSent) {
    	return next(err)
      }
	  console.error(err.stack);
	  res.render('error', { error: err });
	});

}

function editGet(context) {
	return async(req, res, next) => {
		try {
			const entityType = "project-type";	// TODO брать из query-параметров
			const entityProvider = createEntityProvider(context, entityType);

			const body = await entityProvider.provideCreateEntityBody();

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

function editPost(context) {
	return async(req, res, next) => {
		try {
            const entityType = "project-type";  // TODO брать из query-параметров
            const entityProvider = createEntityProvider(context, entityType);
            const entityBody = req.body.code;
            const result = await entityProvider.prepareEntityBodyAndSave(entityBody, req.query.action);

            return res.status(200).send(result);
		} catch (err) {
			console.log(err);
			res.status(err.response.status).send(err.response.data)
		}
	}
}

exports.initRoutes = initRoutes;