const express = require('express');
const { MongoClient } = require('mongodb');
// const objectId = require("mongodb").ObjectId;
const repository = require('./repository')
const winston = require('winston');
const expressWinston = require('express-winston');

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;
const app = express();
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

class Application {

	constructor() {
		this.projectRepository = new repository.ProjectRepository();
		this.snippetRepository = new repository.SnippetRepository();
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
	    app.use(this.logger());
		app.use(express.json())
		app.get('/api/v1/projects', this.projectRepository.fetchProjects);
		app.post('/api/v1/projects', this.projectRepository.createProject);
		app.get('/api/v1/snippets', this.snippetRepository.fetchSnippets);
		app.post('/api/v1/snippets', this.snippetRepository.createSnippet);
	}

	logger() {
		const myFormat = printf(({ level, message, timestamp }) => {
			const parsedDate = new Date(timestamp);
			const dateFormatted = parsedDate.toISOString().
  				replace(/T/, ' ').
  				replace(/\..+/, '');
		  return `${dateFormatted} ${level}: ${message}`;
		});
		return expressWinston.logger({
	      transports: [
	        new winston.transports.Console()
	      ],
	      format: winston.format.combine(
	      	winston.format.timestamp(),
	        winston.format.colorize(),
	        myFormat
	      ),
	      meta: false,
	      msg: "{{req.method}} {{req.url}} {{res.responseTime}}ms",
	      expressFormat: true,
	      colorize: true,
	      ignoreRoute: function (req, res) { return false; }
	    })
	}
}


exports.app = new Application();