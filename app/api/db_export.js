const ObjectId = require("mongodb").ObjectId;
const repository = require('../repository');
const { utils } = require('../utils');
var fs = require('fs');

class DbExportMiddleware {

    constructor(context) {
        this.context = context;
    }


	exportDb() {
		return async(req, res, next) => {
			try {
			    const db = req.app.locals.db;
	    		const projectCollection = db.collection('projects');
	    		const endpointCollection = db.collection('endpoints');
	    		const snippetCollection = db.collection('snippets');

				const projects = await projectCollection.find({}).toArray();
				const endpoints = await endpointCollection.find({}).toArray();
				const snippets = await snippetCollection.find({}).toArray();

			    res.send(utils.wrapResult({
			    	projects: projects,
			    	endpoints: endpoints,
			    	snippets: snippets
			    }));

			} catch (err) {
				next(err);
			}
		}
	}

	importDb() {
		return async (req, res, next) => {
		    const db = req.app.locals.db;
    		const projectCollection = db.collection('projects');
    		const endpointCollection = db.collection('endpoints');
    		const snippetCollection = db.collection('snippets');

			const dbExported = {
				entity: req.body
			}

			const projects = dbExported.entity.projects.map((item) => {
				item._id = new ObjectId(item._id);
				return item;
			});

			const endpoints = dbExported.entity.endpoints.map((item) => {
				item._id = new ObjectId(item._id);
				item.projectId = new ObjectId(item.projectId);
				item.snippets = item.snippets.map((x) => {
					return new ObjectId(x);
				});
				return item;
			});

			const snippets = dbExported.entity.snippets.map((item) => {
				item._id = new ObjectId(item._id);
				return item;
			});

			await projectCollection.deleteMany({});
			await endpointCollection.deleteMany({});
			await snippetCollection.deleteMany({});

			const insertedProjects = await projectCollection.insertMany(projects);
			const insertedEndpoints = await endpointCollection.insertMany(endpoints);
			const insertedSnippets = await snippetCollection.insertMany(snippets);

			// const inserted = { todo: "impl" };
			res.send({
				resProjects: insertedProjects,
				resEndpoints: insertedEndpoints,
				resSnippets: insertedSnippets
			});
		}
	}

	// mockData() {
	// 	// const data = ""
	// 	const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
	// 	return data;
	// }

}

exports.DbExportMiddleware = DbExportMiddleware;