function parser() {
	return function(req, res, next) {
        if (req.path === '/temp' && req.method === 'GET') {
            res.send('MATCH !');
        } else {
            next();
        }
    }
}

exports.parser = parser;