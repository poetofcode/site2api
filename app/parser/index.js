const repository = require('../repository')


function parser(db) {
	return async(req, res, next) => {
		const endpointRepository = new repository.EndpointRepository();
		try {
			const endpoints = await endpointRepository.fetchEndpointsAll(db);
			console.log(endpoints);
		} catch (err) {
			console.log(err);
			return res.status(500).send(err);
		}

		const reqPath = req.baseUrl; 

        if (reqPath === '/site/temp' && req.method === 'GET') {
            res.send('MATCH !');
        } else {
            next();
        }
    }
}

exports.parser = parser;