const express = require('express');
const { MongoClient } = require('mongodb');
const apiMiddleware = require('./api')
const { utils } = require('./utils');
const consoleMiddleware = require('./console');
const parser = require('./parser').parser;
const expressHbs = require("express-handlebars");
const hbs = require("hbs");

const app = express();
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

class Application {

	constructor() {
		this.projectMiddleware = new apiMiddleware.ProjectMiddleware();
		this.snippetMiddleware = new apiMiddleware.SnippetMiddleware();
		this.endpointMiddleware = new apiMiddleware.EndpointMiddleware();
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
		));
		app.set("view engine", "hbs");
		hbs.registerPartials(`${viewsPath}/partials`);
	    app.use(utils.logger());
		app.use(express.json());
		app.use('/site/*', parser(this.getDb()));
		apiRouter.get('/projects', this.projectMiddleware.fetchProjects);
		apiRouter.post('/projects', this.projectMiddleware.createProject);
		apiRouter.get('/snippets', this.snippetMiddleware.fetchSnippets);
		apiRouter.post('/snippets', this.snippetMiddleware.createSnippet);
		apiRouter.patch('/snippets/:id', this.snippetMiddleware.updateSnippet);
		apiRouter.get('/projects/:projectId/endpoints', this.endpointMiddleware.fetchEndpoints);
		apiRouter.post('/projects/:projectId/endpoints', this.endpointMiddleware.createEndpoint);
		apiRouter.patch('/projects/:projectId/endpoints/:id', this.endpointMiddleware.updateEndpoint);
		app.use('/api/v1', apiRouter);

		consoleMiddleware.initRoutes(consoleRouter, this.getDb());
		app.use('/console', consoleRouter);
	}

	getDb() {
		return app.locals.db;
	}
}


exports.app = new Application();