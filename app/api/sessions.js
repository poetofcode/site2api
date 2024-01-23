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
            //
            // TODO брать эти поля из конфига (конфиг не должен попасть в GIT)
            //
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
                const clientIP = parseIp(req);
                const session = await this.sessionRepository.createSession(userName, clientIP);
                res.send(utils.wrapResult(session));
            }
            catch(err) {
                next(err);
            }              
        }
    }

    fetchSessions() {
        return async(req, res, next) => {
            try {
                const sessions = await this.sessionRepository.fetchSessionsAll();
                res.send(utils.wrapResult(sessions));
            }
            catch(err) {
                next(err);
            }  
        }
    }

    fetchSessionByToken() {
        return async(req, res, next) => {
            try {
                const token = req.params.token;
                const session = await this.sessionRepository.fetchSessionByToken(token);
                if (!session) {
                    const err = new Error('Not found');
                    err.status = 400;
                    return next(err)
                }
                res.send(utils.wrapResult(session));
            }
            catch(err) {
                next(err);
            }  
        }
    }

    deleteSessionByToken() {
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

const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress

exports.SessionMiddleware = SessionMiddleware;