class ProjectRepository {

	async createProject(req, res) {
		console.log(req);

		if(!req.body) {
			console.log(1);
			return res.sendStatus(400);
		}
	    const collection = req.app.locals.db.collection("projects");
		const name = req.body.name;
		const baseUrl = req.body.baseUrl;
		if (!name || name == 'undefined') {
			console.log(2);
			return res.sendStatus(400);
		}
		if (!baseUrl || baseUrl == 'undefined') {
			console.log(3);
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

	async fetchProjects(req, res) {
	    const collection = req.app.locals.collection;
	    try{
	        const projects = await collection.find({}).toArray();
	        res.send(projects);
	    }
	    catch(err){
	        console.log(err);
	        res.sendStatus(500);
	    }  
	}
}

exports.ProjectRepository = ProjectRepository 