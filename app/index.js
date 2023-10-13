const express = require('express');
const { MongoClient } = require('mongodb');
const repository = require('./repository')
const { utils } = require('./utils');
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
	    app.use(utils.logger());
		app.use(express.json())
		app.get('/api/v1/projects', this.projectRepository.fetchProjects);
		app.post('/api/v1/projects', this.projectRepository.createProject);
		app.get('/api/v1/snippets', this.snippetRepository.fetchSnippets);
		app.post('/api/v1/snippets', this.snippetRepository.createSnippet);
		app.patch('/api/v1/snippets/:id', this.snippetRepository.updateSnippet);
		app.get('/api/v1/projects/:projectId/endpoints', this.endpointRepository.fetchEndpoints);
		app.post('/api/v1/projects/:projectId/endpoints', this.endpointRepository.createEndpoint);
		app.patch('/api/v1/projects/:projectId/endpoints/:id', this.endpointRepository.updateEndpoint);
	}

}


exports.app = new Application();