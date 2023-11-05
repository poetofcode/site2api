const express = require('express');
const { MongoClient } = require('mongodb');
const apiMiddleware = require('./api')
const { utils } = require('./utils');
const consoleMiddleware = require('./console');
const parser = require('./parser').parser;
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const axios = require('axios');

const app = express();
const mongoClient = new MongoClient("mongodb://mongo_db:27017/");

class Application {

	constructor() {
		this.context = this;
	}

	async start(config) {
		this.config = config;
        await mongoClient.connect();
        app.locals.db = mongoClient.db(this.config.db.name);
        this.initHelpers();
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

		app.use('/site/*', parser(this.context));
		apiMiddleware.initRoutes(apiRouter, this.context);
		app.use('/api/v1', apiRouter);
		consoleMiddleware.initRoutes(consoleRouter, this.context);
		app.use('/console', consoleRouter);
		app.use(express.static(`${__dirname}/public`));
	}

	initHelpers() {
		this.localUrl = `http://0.0.0.0:${this.config.port}/api/v1`;
		this.apiGet = (url) => {
			return axios.get(`${this.localUrl}${url}`);
		}
	}

	getDb() {
		return app.locals.db;
	}
}


exports.app = new Application();
