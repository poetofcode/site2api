const repository = require('../repository');
const { utils } = require('../utils');

class ConfigMiddleware {

    constructor(context) {
        this.context = context;
    }

    editConfig() {
        return async(req, res, next) => {
            try {
                const config = req.body;
                this.context.configRepository.saveConfig(config);
                res.send(utils.wrapResult({ result: "ok" }));
            }
            catch(err) {
                next(err);
            }              
        }
    }

    fetchConfig() {
        return async(req, res, next) => {
            try {
                const config = this.context.configRepository.fetchConfig();
                res.send(utils.wrapResult(config));
            }
            catch(err) {
                next(err);
            }  
        }
    }

}

exports.ConfigMiddleware = ConfigMiddleware;