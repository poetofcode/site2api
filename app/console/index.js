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
	router.patch('/edit', editPatch(context));

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
			// const snippetId = req.params.snippetId;
			// console.log(`snippetId: ${snippetId}`);
			// const snippet = (await this.context.apiGet(`/snippets/${snippetId}`)).data.result;

			const entityType = "project-type";	// TODO брать из query-параметров
			const entityProvider = createEntityProvider(context, entityType);

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

function editPatch(context) {
	return async(req, res, next) => {
		try {
            const entityType = "project-type";  // TODO брать из query-параметров
            const entityProvider = createEntityProvider(context, entityType);
            const entityBody = req.body.code;
            const result = await entityProvider.prepareEntityBodyAndSave(entityBody);

            console.log("RES:");
            console.log(result);

            return res.status(200).send(result);

			// throw new Exception("to-do: implement!")
			// const err = new Error('Not found hgjhgjh');
   //      	err.status = 400;
   //      	return res.status(400).send({
   //      		error: "Description"
   //      	})

		} catch (err) {
			next(err);
		}
	}
}

exports.initRoutes = initRoutes;