const ObjectId = require("mongodb").ObjectId;

class ProjectRepository {

	constructor(context) {
		this.db = context.getDb();
	}

	async fetchProjectsAll() {
	    const endpointCollection = this.db.collection("endpoints");
		const projectCollection = this.db.collection('projects');
		const projects = await projectCollection.find({}).toArray();

		const projectsFull = projects.map(async (item) => {
			const endpointsByItem = await endpointCollection.find({ projectId: item._id }).toArray();
			item.endpoints = endpointsByItem;
			return item;
		});

		return await Promise.all(projectsFull);
	}

	async fetchProjectById(projectId) {
	    const endpointCollection = this.db.collection("endpoints");
		const projectCollection = this.db.collection('projects');
		const project = await projectCollection.findOne({ _id : new ObjectId(projectId)});

		if (project) {
			const endpointsByItem = await endpointCollection.find({ projectId: project._id }).toArray();
			project.endpoints = endpointsByItem;
			return project;
		}

		return null;
	}
}

exports.ProjectRepository = ProjectRepository 