const express = require('express');
const { MongoClient } = require('mongodb');
const repository = require('./repository')
const { utils } = require('./utils');
const parser = require('./parser').parser;
const expressHbs = require("express-handlebars");
const hbs = require("hbs");

const app = express();
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

class Application {

	constructor() {
		this.projectRepository = new repository.ProjectRepository();
		this.snippetRepository = new repository.SnippetRepository();
		this.endpointRepository = new repository.EndpointRepository();
	}

	async start(config) {
		this.config = config;
        await mongoClient.connect();
        app.locals.db = mongoClient.db(this.config.db.name);
        this.initAPI();
        return app.listen(this.config.port);
	}

	initAPI() {
		const apiRouter = express.Router();
		const consoleRouter = express.Router();
		const viewsPath = `${__dirname}/views`;
		app.set("views", viewsPath);
		app.engine("hbs", expressHbs.engine(
		    {
		        layoutsDir: `${viewsPath}/layouts`, 
		        defaultLayout: "layout",
		        extname: "hbs"
		    }
		))
		app.set("view engine", "hbs");
		hbs.registerPartials(`${viewsPath}/partials`);
	    app.use(utils.logger());
		app.use(express.json());
		app.use('/site/*', parser(this.getDb()));
		apiRouter.get('/projects', this.projectRepository.fetchProjects);
		apiRouter.post('/projects', this.projectRepository.createProject);
		apiRouter.get('/snippets', this.snippetRepository.fetchSnippets);
		apiRouter.post('/snippets', this.snippetRepository.createSnippet);
		apiRouter.patch('/snippets/:id', this.snippetRepository.updateSnippet);
		apiRouter.get('/projects/:projectId/endpoints', this.endpointRepository.fetchEndpoints);
		apiRouter.post('/projects/:projectId/endpoints', this.endpointRepository.createEndpoint);
		apiRouter.patch('/projects/:projectId/endpoints/:id', this.endpointRepository.updateEndpoint);
		app.use('/api/v1', apiRouter);

		consoleRouter.get("/", function(_, response){
		    response.render("projects.hbs");
		});
		consoleRouter.get("/endpoints", function(_, response){
		    response.render("endpoints.hbs");
		});
		app.use('/console', consoleRouter);
	}	

	getDb() {
		return app.locals.db;
	}
}


exports.app = new Application();