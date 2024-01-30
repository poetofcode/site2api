const ObjectId = require("mongodb").ObjectId;
const repository = require('../repository');
const { utils } = require('../utils');

class DbExportMiddleware {

    constructor(context) {
        this.context = context;
        // this.sessionRepository = new repository.SessionRepository(context);
    }


	exportDb() {
		return async(req, res, next) => {
			/*
		    try {
		        const projects = await this.projectRepository.fetchProjectsAll();
		        res.send(utils.wrapResult(projects));
		    }
		    catch(err) {
		    	next(err);
		    } 
		    */ 
		    const db = req.app.locals.db;
    		const projectCollection = db.collection('projects');
			const projects = await projectCollection.find({}).toArray();

    		const endpointCollection = db.collection('endpoints');
			const endpoints = await endpointCollection.find({}).toArray();

    		const snippetCollection = db.collection('snippets');
			const snippets = await snippetCollection.find({}).toArray();

		    res.send({
		    	projects: projects.map((item) => {
		    		// delete item['_id'];
		    		return item;
		    	}),
		    	endpoints: endpoints,
		    	snippets: snippets
		    });
		}
	}

	importDb() {
		return async (req, res, next) => {
		    const db = req.app.locals.db;
    		const projectCollection = db.collection('projects');

    		const dbExported = [
			    {
			      _id: new ObjectId("6526eb50eb906e64f9b2ad01"),
			      name: "Rutracker",
			      baseUrl: "rutracker"
			    },
			    {
			      _id: new ObjectId("65324b488885b76805b850ae"),
			      name: "Example",
			      baseUrl: "sluts"
			    }
			  ];

			// TODO try

			await projectCollection.deleteMany({});

			const inserted = await projectCollection.insertMany(dbExported);

			res.send(inserted);
		}
	}

}

exports.DbExportMiddleware = DbExportMiddleware;