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
            const refName = "admin";
            const refPassword = "qwerty123";

            if(!req.body) {
                return next(utils.buildError(400, 'Body is empty'))
            }
            const userName = req.body.name;
            const password = req.body.password;

            if (!userName || userName == 'undefined') {
                return next(utils.buildError(400, '"name" is empty'))
            }
            if (!password || password == 'undefined') {
                return next(utils.buildError(400, '"password" is empty'))
            }

            if (userName !== refName || password !== refPassword) {
                return next(utils.buildError(400, 'Invalid login or password'));
            }

            try {
                const session = await this.sessionRepository.createSession(userName);
                res.send(utils.wrapResult(session));
            }
            catch(err) {
                next(err);
            }              
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
            // try {
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