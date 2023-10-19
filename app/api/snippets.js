const ObjectId = require("mongodb").ObjectId;
const repository = require('../repository');
const { utils } = require('../utils');

class SnippetMiddleware {

	constructor(context) {
		this.context = context;
		this.snippetRepository = new repository.SnippetRepository(this.context);
	}

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

	fetchSnippetById() {
		return async(req, res, next) => {
		    try {
		        const snippet = await this.snippetRepository.fetchSnippetById(req.params.id);
		        if (!snippet) {
		        	const err = new Error('Not found');
		        	err.status = 400;
		        	return next(err)
		        }
		        res.send(utils.wrapResult(snippet));
		    }
		    catch(err) {
		    	next(err);
		    }  
		}
	}

	async updateSnippet(req, res) {
		if(!req.body) {
			return res.sendStatus(400);
		}
	    const collection = req.app.locals.db.collection("snippets");
		const name = req.body.name;
		const endpointId = req.body.endpointId;
		const projectId = req.body.projectId;
		const code = req.body.code;
		const id = req.params.id;

		const snippet = {};
		if (name && name != 'undefined') {
			snippet.name = name;
		}
		if (endpointId && endpointId != 'undefined') {
			snippet.endpointId = endpointId;
		}
		if (projectId && projectId != 'undefined') {
			snippet.projectId = projectId;
		}
		if (code && code != 'undefined') {
			snippet.code = code;
		}

		if (snippet == {}) {
			return res.status(400).send("No found fields for update");
		}

	    try{
			const result = await collection.findOneAndUpdate(
				{ _id : new ObjectId(id) }, 
				{ $set: snippet }, 
				{ returnDocument: "after" }
			);
	        res.send(result.value);
	    } 
	    catch(err){
	    	console.log(err);
	        res.status(500).send(err);
	    }      
	}

}

exports.SnippetMiddleware = SnippetMiddleware;