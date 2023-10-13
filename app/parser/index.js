const repository = require('../repository')


function parser(db) {
	return async(req, res, next) => {
		const endpointRepository = new repository.EndpointRepository();
		const endpoints = await endpointRepository.fetchEndpointsAll(db);
		console.log(endpoints);

		const reqPath = req.baseUrl; 

        if (reqPath === '/site/temp' && req.method === 'GET') {
            res.send('MATCH !');
        } else {
            next();
        }
    }
}

exports.parser = parser;