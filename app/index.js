const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require("mongodb").ObjectId;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

class Application {

	async start(config) {
		this.config = config;
        await mongoClient.connect();
        app.locals.collection = mongoClient.db(this.config.db.name).collection("projects");
        return app.listen(this.config.port);
	}
}

app.get("/api/v1/projects", async (req, res) => {
    const collection = req.app.locals.collection;
    try{
        const projects = await collection.find({}).toArray();
        res.send(projects);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});


exports.app = new Application();