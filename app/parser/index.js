const repository = require('../repository')
const axios = require('axios');
const cheerio = require("cheerio");
const iconv = require('iconv-lite');

const codeLayout = `(function() {
	{{snippet}}
	return process;
})();
`;

// Система роутинга
let routes = [];

function matchRoute(path) {
    for (const route of routes) {
        const match = route.pattern.exec(path);
        if (match) {
            const params = {};
            match.slice(1).forEach((value, index) => {
                params[route.keys[index]] = value;
            });
            return { endpoint: route.endpoint, params };
        }
    }
    return null;
}

function parseQueryString(queryString) {
    const params = {};
    queryString.split('&').forEach(part => {
        const [key, value] = part.split('=').map(decodeURIComponent);
        params[key] = value;
    });
    return params;
}

function registerRoute(method, path, endpoint) {
    const tokens = path.split('/').slice(1);
    const patternParts = [];
    const keys = [];
    tokens.forEach(token => {
        if (token.startsWith(':')) {
            keys.push(token.slice(1));
            patternParts.push('([^/]+)');
        } else {
            patternParts.push(token);
        }
    });
    const pattern = new RegExp('^/' + patternParts.join('/') + '$');
    routes.push({
        pattern,
        keys,
        endpoint: endpoint,
        method
    });
}

function parser(context) {
	return async(req, res, next) => {
		const reqPath = req.originalUrl;
		if (!reqPath.startsWith('/site')) {
			return next();
		}
		const endpointRepository = new repository.EndpointRepository(context);
		try {
			const endpoints = await endpointRepository.fetchEndpointsAll();
			routes = [];
			endpoints.filter((item) => item.project).forEach((item) => {
				const itemPath = `/site/${item.project.baseUrl}/${item.url}`;
				const method = item.method.toUpperCase();
				registerRoute(method, itemPath, item);
			});

			// console.log(routes);

		    const [path, queryString] = reqPath.split('?');
		    const routeMatch = matchRoute(path);
		    if (!routeMatch) {
	    		console.log("No found matching route");
	    		return next();	
		    } else {
		    	// console.log('Found route');
		    	// console.log(routeMatch);
		    }

	        const parsedParams = routeMatch.params;
	        const parsedQuery = queryString ? parseQueryString(queryString) : {};
	        
			// Процессим код из сниппетов найденного endpoint
			const found = routeMatch.endpoint;
			const snippetFuncs = found.snippets.map((snippet) => {
				const wrappedCode = codeLayout.replace('{{snippet}}', snippet.code);
				return eval(wrappedCode);
			});

			let _params = {
				params: parsedParams,
				query: parsedQuery,
			};
			await Promise.all(snippetFuncs.map(async (func) => {
				_params.result = await func(_params);
			}));

			return res.send(_params.result);

		} catch (err) {
			console.log(err);
			return res.status(500).send(err);
		}
    }
}

exports.parser = parser;