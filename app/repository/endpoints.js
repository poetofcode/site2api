const ObjectId = require("mongodb").ObjectId;

class EndpointRepository {

	constructor(context) {
		this.context = context;
	}

	async fetchEndpointsAll() {
		const db = this.context.getDb();
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

	async fetchEndpointsByProjectId(projectId) {
		const db = this.context.getDb();
	    const collection = db.collection("endpoints");
		const snippetCollection = db.collection('snippets');
		const projectCollection = db.collection('projects');

		const endpoints = await collection.find({ projectId: new ObjectId(projectId) }).toArray();

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