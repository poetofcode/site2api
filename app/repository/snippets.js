const ObjectId = require("mongodb").ObjectId;

class SnippetRepository {

	constructor(context) {
		this.context = context;
		this.db = context.getDb();
	}

	async fetchSnippets(req, res) {
		// TODO
	}

	async fetchSnippetById(snippetId) {
		console.log('Snippet id: ' + snippetId);
	    const collection = this.db.collection("snippets");
		const snippet = await collection.findOne({ _id : new ObjectId(snippetId)});
		return snippet || null;
	}

}

exports.SnippetRepository = SnippetRepository;