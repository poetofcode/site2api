const ObjectId = require("mongodb").ObjectId;

class EndpointRepository {

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

}

exports.EndpointRepository = EndpointRepository;