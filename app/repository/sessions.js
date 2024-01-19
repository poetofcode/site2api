const ObjectId = require("mongodb").ObjectId;
const crypto = require('crypto');

class SessionRepository {

    constructor(context) {
        this.db = context.getDb();
        this.sessionCollection = this.db.collection('sessions');
    }

    async createSession(userName) {
        const newSession = {
            token: crypto.randomUUID(),
            createdAt: new Date(),
            user: userName,
        }
        const sessions = await this.sessionCollection.insertOne(newSession);
        return newSession;
    }

    async fetchSessionsAll() {
        // const endpointCollection = this.db.collection("endpoints");
        // const projectCollection = this.db.collection('projects');
        // const projects = await projectCollection.find({}).toArray();

        // const projectsFull = projects.map(async (item) => {
        //     const endpointsByItem = await endpointCollection.find({ projectId: item._id }).toArray();
        //     item.endpoints = endpointsByItem;
        //     return item;
        // });

        // return await Promise.all(projectsFull);
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