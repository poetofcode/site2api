const ProjectEntityProvider = require('./project_provider.js').ProjectEntityProvider;

function createEntityProvider(context, entityType) {
    // TODO
    return new ProjectEntityProvider(context);
}

exports.createEntityProvider = createEntityProvider;