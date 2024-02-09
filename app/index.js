const express = require('express');
const { MongoClient } = require('mongodb');
const apiMiddleware = require('./api')
const { utils } = require('./utils');
const consoleMiddleware = require('./console');
const siteMiddleware = require('./parser');
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const axios = require('axios');
const cookieParser = require('cookie-parser');
const util = require('util');
const repository = require('./repository');

const app = express();
const LOG_LIMIT_LENGTH = 100000;

class Application {

	constructor() {
		this.context = this;
		this.configRepository = new repository.ConfigRepository(this.context);
		collectStdout();
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
		const siteRouter = express.Router();
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
		app.use(express.urlencoded());
		app.use(cookieParser());

		siteMiddleware.initRoutes(siteRouter, this.context);
		app.use('/site', siteRouter);
		apiMiddleware.initRoutes(apiRouter, this.context);
		app.use('/api/v1', apiRouter);
		consoleMiddleware.initRoutes(consoleRouter, this.context);
		app.use('/console', consoleRouter);
		app.use(express.static(`${__dirname}/public`));
	}

	initHelpers() {
		function headersWithAuth(headers, token) {
			if (token) {
				headers['Authorization'] = `Bearer ${token}`;
			} 
			return headers;
		}

		this.localUrl = `http://0.0.0.0:${this.config.port}/api/v1`;
		this.apiGet = (url, token) => {
			return axios({
	          method: 'get',
	          url: `${this.localUrl}${url}`,
	          headers: headersWithAuth({}, token)
	        });
		}

		this.apiPost = (url, data, token) => {
			const result = axios({
	          method: 'post',
	          url: `${this.localUrl}${url}`,
	          // SRC: https://ru.stackoverflow.com/questions/1159061/axios-%D0%9A%D0%B0%D0%BA-%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-post
	          // params: {
	          //   user_key_id: 'USER_KEY_ID',
	          // },
	          data: data,
	          headers: headersWithAuth({
	            "Content-type": "application/json; charset=UTF-8"
	          }, token)
	        });
			return result;
		}

		this.apiPatch = (url, data, token) => {
			const result = axios({
	          method: 'patch',
	          url: `${this.localUrl}${url}`,
	          // SRC: https://ru.stackoverflow.com/questions/1159061/axios-%D0%9A%D0%B0%D0%BA-%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-post
	          // params: {
	          //   user_key_id: 'USER_KEY_ID',
	          // },
	          data: data,
	          headers: headersWithAuth({
	            "Content-type": "application/json; charset=UTF-8"
	          }, token)
	        });
			return result;
		}
	}

	getDb() {
		return app.locals.db;
	}
}

function collectStdout() {
	global.logDump = ''
	process.stdout._orig_write = process.stdout.write;
	process.stdout.write = (data) => {
	  global.logDump += data.toString();
	  if (global.logDump.length > LOG_LIMIT_LENGTH) {
	  	global.logDump = global.logDump.slice(global.logDump.length - LOG_LIMIT_LENGTH);
	  }
	  process.stdout._orig_write(data);
	}
}

exports.app = new Application();
