class SnippetRepository {

	async createSnippet(req, res) {
		if(!req.body) {
			return res.sendStatus(400);
		}
	    const collection = req.app.locals.db.collection("snippets");
		const name = req.body.name;
		const baseUrl = req.body.baseUrl;
		if (!name || name == 'undefined') {
			return res.sendStatus(400);
		}
		if (!baseUrl || baseUrl == 'undefined') {
			return res.sendStatus(400);
		}
		const project = { 
			name: name,
			baseUrl: baseUrl
		}

	    try{
	        const projects = await collection.insertOne(project);
	        res.send(project);
	    }
	    catch(err){
	        console.log(err);
	        res.sendStatus(500);
	    }      
	}

	async fetchSnippets(req, res) {
		console.log(1);
		res.send({});
	}

}

exports.SnippetRepository = SnippetRepository;