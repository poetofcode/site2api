const repository = require('../repository');
const { utils } = require('../utils');

class ProjectMiddleware {

	constructor(context) {
		this.context = context;
		this.projectRepository = new repository.ProjectRepository(context);
	}

	async createProject(req, res) {
		if(!req.body) {
			return res.sendStatus(400);
		}
	    const collection = req.app.locals.db.collection("projects");
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

	fetchProjects() {
		return async(req, res, next) => {
		    try {
		        const projects = await this.projectRepository.fetchProjectsAll();
		        res.send(utils.wrapResult(projects));
		    }
		    catch(err) {
		    	next(err);
		    }  
		}
	}
}

exports.ProjectMiddleware = ProjectMiddleware 