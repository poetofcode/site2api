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

    async fetchSessionByToken(token) {
        const session = await this.sessionCollection.findOne({ token : token });
        return session;
    }

    async deleteSessionToken(token) {
        const result = await this.sessionCollection.deleteOne({ token : token });
        return result;
    }

}

exports.SessionRepository = SessionRepository;