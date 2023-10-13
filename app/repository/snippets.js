class SnippetRepository {

	async createSnippet(req, res) {
		if(!req.body) {
			return res.sendStatus(400);
		}
	    const collection = req.app.locals.db.collection("snippets");
		const name = req.body.name;
		const endpointId = req.body.endpointId;
		const projectId = req.body.projectId;
		const code = req.body.code;

		if (!code || code == 'undefined') {
			return res.status(400).send('Field "code" undefined');
		}

		const snippet = {
			code: code
		};
		if (name && name != 'undefined') {
			snippet.name = name;
		}
		if (endpointId && endpointId != 'undefined') {
			snippet.endpointId = endpointId;
		}
		if (projectId && projectId != 'undefined') {
			snippet.projectId = projectId;
		}

	    try{
	        await collection.insertOne(snippet);
	        res.send(snippet);
	    }
	    catch(err){
	        res.status(500).send(err);
	    }      
	}

	async fetchSnippets(req, res) {
		res.send({});
	}

}

exports.SnippetRepository = SnippetRepository;