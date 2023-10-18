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

}

exports.ProjectRepository = ProjectRepository 