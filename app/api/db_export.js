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
			    res.send(utils.wrapResult(await this.getCurrentDbExport(db)));
			} catch (err) {
				next(err);
			}
		}
	}

	async getCurrentDbExport(db) {
		const projectCollection = db.collection('projects');
		const endpointCollection = db.collection('endpoints');
		const snippetCollection = db.collection('snippets');

		const projects = await projectCollection.find({}).toArray();
		const endpoints = await endpointCollection.find({}).toArray();
		const snippets = await snippetCollection.find({}).toArray();

	    return {
	    	projects: projects,
	    	endpoints: endpoints,
	    	snippets: snippets
	    };
	}

	createBackup() {
		return async (req, res, next) => {
		    const db = req.app.locals.db;
		    try {
			    const dbExport = await this.getCurrentDbExport(db);
				fs.writeFileSync('./app/db_backup/db_backup.json', JSON.stringify(dbExport));
				res.send(utils.wrapResult({ result: "Ok" }));
			} catch (err) {
				next(err);
			}
		}
	}

	fetchBackup() {
		return async (req, res, next) => {
		    try {
			    const dbExport = fs.readFileSync('./app/db_backup/db_backup.json', 'utf8');
				res.send(utils.wrapResult({ result: JSON.parse(dbExport) }));
			} catch (err) {
				next(err);
			}
		}
	}

	importDb() {
		return async (req, res, next) => {
		    try {
			    const dbExport = await this.getCurrentDbExport(db);
				fs.writeFileSync('./app/db_backup/db_backup.json', JSON.stringify(dbExport));
				console.log("Backup created OK");
			} catch (err) {
				console.log("Backup creation ERROR:");
				console.log(err);
				// Бэкапип DB, но не останавливаем работу в случае эксепшена
			}

			try {
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

				res.send(utils.wrapResult({
					result: {
						resProjects: insertedProjects,
						resEndpoints: insertedEndpoints,
						resSnippets: insertedSnippets
					}
				}));

			} catch (err) {
				next(err);
			}
		}
	}

}

exports.DbExportMiddleware = DbExportMiddleware;