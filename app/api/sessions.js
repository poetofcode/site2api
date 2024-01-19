const ObjectId = require("mongodb").ObjectId;
const repository = require('../repository');
const { utils } = require('../utils');

class SessionMiddleware {

    constructor(context) {
        this.context = context;
        this.sessionRepository = new repository.SessionRepository(context);
    }

    createSession() {
        return async(req, res, next) => {
            // if(!req.body) {
            //     return next(utils.buildError(400, 'Body is empty'))
            // }
            // const collection = req.app.locals.db.collection("projects");
            // const name = req.body.name;
            // const baseUrl = req.body.baseUrl;
            // if (!name || name == 'undefined') {
            //     return next(utils.buildError(400, '"name" is empty'))
            // }
            // if (!baseUrl || baseUrl == 'undefined') {
            //     return next(utils.buildError(400, '"baseUrl" is empty'))
            // }
            // const project = { 
            //     name: name,
            //     baseUrl: baseUrl
            // }

            // try{
            //     const projects = await collection.insertOne(project);
            //     res.send(utils.wrapResult({ result: project }));
            // }
            // catch(err){
            //     console.log(err);
            //     next(err);
            // }      
        }
    }

    fetchSessions() {
        return async(req, res, next) => {
            // try {
            //     const projects = await this.projectRepository.fetchProjectsAll();
            //     res.send(utils.wrapResult(projects));
            // }
            // catch(err) {
            //     next(err);
            // }  
        }
    }

    fetchSessionById() {
        return async(req, res, next) => {
            try {
            //     const project = await this.projectRepository.fetchProjectById(req.params.id);
            //     if (!project) {
            //         const err = new Error('Not found');
            //         err.status = 400;
            //         return next(err)
            //     }
            //     res.send(utils.wrapResult(project));
            // }
            // catch(err) {
            //     next(err);
            // }  
        }
    }

    deleteSession() {
        return async(req, res, next) => {
            // try {
            //     await this.projectRepository.deleteProjectById(req.params.id);
            //     res.send(utils.wrapResult('ok'));
            // }
            // catch(err) {
            //     next(err);
            // }  
        }
    }

}

exports.SessionMiddleware = SessionMiddleware;