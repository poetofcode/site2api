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

class Application {

	constructor() {
		this.context = this;
	}

	async start(config) {
		this.config = config;
		const mongoClient = new MongoClient(this.config.db.url);
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

		this.apiPost = (url, data) => {
			const result = axios({
	          method: 'post',
	          url: `${this.localUrl}${url}`,
	          // SRC: https://ru.stackoverflow.com/questions/1159061/axios-%D0%9A%D0%B0%D0%BA-%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-post
	          // params: {
	          //   user_key_id: 'USER_KEY_ID',
	          // },
	          data: data,
	          headers: {
	            "Content-type": "application/json; charset=UTF-8"
	          }
	        });
			return result;
		}

		this.apiPatch = (url, data) => {
			const result = axios({
	          method: 'patch',
	          url: `${this.localUrl}${url}`,
	          // SRC: https://ru.stackoverflow.com/questions/1159061/axios-%D0%9A%D0%B0%D0%BA-%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-post
	          // params: {
	          //   user_key_id: 'USER_KEY_ID',
	          // },
	          data: data,
	          headers: {
	            "Content-type": "application/json; charset=UTF-8"
	          }
	        });
			return result;
		}
	}

	getDb() {
		return app.locals.db;
	}
}


exports.app = new Application();
