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
		app.get("/api/v1/projects", this.projectRepository.fetchProjects);
		app.post("/api/v1/projects", this.projectRepository.createProject);
	}

	logger() {
		const myFormat = printf(({ level, message, timestamp }) => {
			const parsedDate = new Date(timestamp);
			const dateFormatted = parsedDate.toISOString().
  				replace(/T/, ' ').      // replace T with a space
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
	      meta: false, // optional: control whether you want to log the meta data about the request (default to true)
	      msg: "{{req.method}} {{req.url}} {{res.responseTime}}ms", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
	      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
	      colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
	      ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
	    })
	}
}


exports.app = new Application();