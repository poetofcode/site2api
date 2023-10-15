const repository = require('../repository')

const codeLayout = `(function() {
	{{snippet}}
	return process;
})();
`;

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

				console.log(`itemPath = ${itemPath}`);

				return itemPath === reqPath;
			});

			if (!found || found == 'undefined') {
				console.log('NOT FOUND');
				return next();
			} else {
				console.log('FOUND');
			}

			// Процессим код из сниппетов найденного endpoint
			const snippetFuncs = found.snippets.map((snippet) => {
				const wrappedCode = codeLayout.replace('{{snippet}}', snippet.code);
				console.log(wrappedCode);
				return eval(wrappedCode);
			});

			let _params = {
				// TODO fill
			};
			await Promise.all(snippetFuncs.map(async (func) => {
				_params.result = await func(_params);
			}));

			console.log(_params);

			return res.send(_params.result);

		} catch (err) {
			console.log(err);
			return res.status(500).send(err);
		}
    }
}

exports.parser = parser;