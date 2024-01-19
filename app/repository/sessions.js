const ObjectId = require("mongodb").ObjectId;
const crypto = require('crypto');

class SessionRepository {

    constructor(context) {
        this.db = context.getDb();
        this.sessionCollection = this.db.collection('sessions');
    }

    async createSession(userName, clientIP) {
        const newSession = {
            token: crypto.randomUUID(),
            createdAt: new Date(),
            user: userName,
            ip: clientIP
        }
        const sessions = await this.sessionCollection.insertOne(newSession);
        return newSession;
    }

    async fetchSessionsAll() {
        const sessions = await this.sessionCollection.find({}).toArray();
        return sessions;
    }

    async fetchSessionById(projectId) {
        // const endpointCollection = this.db.collection("endpoints");
        // const projectCollection = this.db.collection('projects');
        // const project = await projectCollection.findOne({ _id : new ObjectId(projectId)});

        // if (project) {
        //     const endpointsByItem = await endpointCollection.find({ projectId: project._id }).toArray();
        //     project.endpoints = endpointsByItem;
        //     return project;
        // }

        // return null;
    }

    async deleteSession(projectId) {
        // // TODO возможно нужно удалять в будущем связанные эндпойнты
        // const projectCollection = this.db.collection('projects');
        // const result = await projectCollection.deleteOne({ _id : new ObjectId(projectId)});
        // return result;
    }

}

exports.SessionRepository = SessionRepository;