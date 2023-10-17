const ObjectId = require("mongodb").ObjectId;

class EndpointMiddleware {

	async fetchEndpoints(req, res) {
		res.send({});
	}

	async createEndpoint(req, res) {
		if(!req.body) {
			return res.sendStatus(400);
		}
	    const collection = req.app.locals.db.collection("endpoints");
		const snippetCollection = req.app.locals.db.collection('snippets');
		const projectCollection = req.app.locals.db.collection('projects');

		const url = req.body.url;
		const snippets = req.body.snippets;
		const method = req.body.method;
		const name = req.body.name;
		const projectId = req.params.projectId;

		if (!url || url == 'undefined') {
			return res.status(400).send('Field "url" undefined');
		}
		if (!snippets || !Array.isArray(snippets) || !(arr => snippets.every(i => typeof i === "string"))) {
			return res.status(400).send('Field "snippets" undefined or not valid');
		}
		if (!method || method == 'undefined') {
			return res.status(400).send('Field "method" undefined');
		}

		// Проверяем наличие projectId в базе
		let _projectId = ""; 
		try {
			_projectId = new ObjectId(projectId);
			const foundProjects = await projectCollection.find({ _id: _projectId }).toArray();
			if (foundProjects.length == 0) {
				return res.status(400).send(`Project with id '${projectId}' not found`);
			}
		}
		catch(err) {
			console.log(err);
			return res.status(500).send(err);
		}

		// Проверяем наличие spinnet-ids в базе
		let _snippetIds = [];
		try {
			_snippetIds = snippets.map(id => new ObjectId(id));
			const foundSnippets = await snippetCollection.find({ _id: { $in: _snippetIds } }).toArray();
			if (foundSnippets.length < snippets.length) {
				return res.status(400).send('Not all snippet ids were found in the DB');
			}
		}
		catch(err) {
			console.log(err);
			return res.status(500).send(err);
		}

		// Валидируем method
		if (['get', 'post', 'patch', 'delete'].includes(method) == false) {
			return res.status(400).send(`Method '${method}' not allowed`);			
		}

		const endpoint = {
			projectId: _projectId,
			url: url,
			snippets: _snippetIds,
			method: method
		};
		if (name && name != 'undefined') {
			endpoint.name = name;
		}

	    try{
	        await collection.insertOne(endpoint);
	        res.send(endpoint);
	    } 
	    catch(err){
	    	console.log(err);
	        res.status(500).send(err);
	    }      		
	}

	async updateEndpoint(req, res) {
		res.send({});
	}

	async fetchEndpointsAll(db) {
	    const collection = db.collection("endpoints");
		const snippetCollection = db.collection('snippets');
		const projectCollection = db.collection('projects');

		const endpoints = await collection.find({}).toArray();

		const endpointsFull = endpoints.map(async (item) => {
			const snippetsByItem = await snippetCollection.find({ _id: { $in : item.snippets } }).toArray();
			const projectByEndpoint = await projectCollection.findOne({ _id: item.projectId });
			item.snippets = snippetsByItem;
			item.project = projectByEndpoint;
			return item;
		});

		return await Promise.all(endpointsFull);
	}

	log(arr, title) {
		console.log(`================ ${title}:`);
		console.log(arr);
	}
}

exports.EndpointMiddleware = EndpointMiddleware;