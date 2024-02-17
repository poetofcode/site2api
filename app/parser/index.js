const repository = require('../repository')
const axios = require('axios');
const cheerio = require("cheerio");
const iconv = require('iconv-lite');
const crypto = require('crypto');
const { utils } = require('../utils');

const codeLayout = `(function() {
	{{snippet}}
	return process;
})();
`;

// Система роутинга
let routes = [];
let tokenInfo;

const TOKEN_LIFETIME_SECONDS = 15 * 60;

function createToken() {
	return {
		token: crypto.randomUUID(),
		createdAt: (new Date()).getTime()
	}
};

function isTokenExpired() {
	const currentDate = new Date();
	const timestamp = currentDate.getTime();
	const diffSeconds = (timestamp - tokenInfo.createdAt) / 1000;
	return diffSeconds > TOKEN_LIFETIME_SECONDS;
}

function getActualToken() {
	if (!tokenInfo || !tokenInfo.token || !tokenInfo.createdAt) {
		tokenInfo = createToken();
	}
	if (isTokenExpired()) {
		tokenInfo = createToken();
	}
	return tokenInfo.token;
}


function initRoutes(router, context) {
	router.use(async function (req, res, next) {
		if (req.path === '/token') {
			return next();
		}

		const config = context.configRepository.fetchConfig();
		const salt = config.api_key;

		if (config.debug_enabled && req.query["debug_key"] === config.debug_key) {
			return next();
		}

		const authHeader = req.header('Authorization');
		if (!authHeader) {
			return res.status(401).send(utils.wrapError(new Error('Not authorized')));
		}

		const clientTotalHash = authHeader.replace('Bearer ', '');
		const serverTotalHash = totalHash(`/site${req.path}`, getActualToken(), salt);

		if (clientTotalHash.toUpperCase() === serverTotalHash.toUpperCase()) {
			return next();
		}

		res.status(401).send(utils.wrapError(new Error('Not authorized')));
	});

	router.post("/token", async (req, res, next) => {
		res.send(utils.wrapResult({ token: getActualToken() }));
	});

	router.use(parser(context));
}


function hash(arg) {
	var shasum = crypto.createHash('sha1');
	shasum.update(arg);
	return shasum.digest('hex').toString();
}

function totalHash(path, token, salt) {
	return hash(hash(path) + hash(token) + hash(salt));
}

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

			delete found.project._id;
			let _params = {
				params: parsedParams,
				query: parsedQuery,
				project: found.project,
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

exports.initRoutes = initRoutes;