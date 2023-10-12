const express = require('express');
const { MongoClient } = require('mongodb');
// const objectId = require("mongodb").ObjectId;
const repository = require('./repository')

const app = express();
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

class Application {

	constructor() {
		this.projectRepository = new repository.ProjectRepository();
	}

	async start(config) {
		this.config = config;
        await mongoClient.connect();
        app.locals.collection = mongoClient.db(this.config.db.name).collection("projects");
        app.locals.db = mongoClient.db(this.config.db.name);
        this.initAPI();
        return app.listen(this.config.port);
	}

	initAPI() {
		app.use(express.json())
		app.get("/api/v1/projects", this.projectRepository.fetchProjects);
		app.post("/api/v1/projects", this.projectRepository.createProject);
	}
}


exports.app = new Application();