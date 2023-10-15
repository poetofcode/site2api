const repository = require('../repository')


function parser(db) {
	return async(req, res, next) => {
		const reqPath = req.baseUrl;
		if (!reqPath.startsWith('/site')) {
			return next();
		}
		const endpointRepository = new repository.EndpointRepository();
		try {
			const endpoints = await endpointRepository.fetchEndpointsAll(db);
			console.log(endpoints);

			// Фильтруем эндпоинты по методам
			const filtered = endpoints.filter((endpoint) => req.method === endpoint.method.toUpperCase());
			const found = filtered.find((item) => {
				const itemPath = `/site/${item.project.baseUrl}/${item.url}`;
				return itemPath === reqPath;
			});

			if (!found || found != 'undefined') {
				return next();
			}


			// TODO process code from snippets


	        if (reqPath === '/site/temp' && req.method === 'GET') {
	            res.send('MATCH !');
	        } else {
	            next();
	        }
		} catch (err) {
			console.log(err);
			return res.status(500).send(err);
		}
    }
}

exports.parser = parser;