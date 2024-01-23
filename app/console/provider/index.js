const ProjectEntityProvider = require('./project_provider.js').ProjectEntityProvider;
const EndpointEntityProvider = require('./endpoint_provider.js').EndpointEntityProvider;

function createEntityProvider(context, entityType, token) {
    switch(entityType) {
        case 'project':
            return new ProjectEntityProvider(context, token);

        case 'endpoint':
            return new EndpointEntityProvider(context, token);
    }

    throw new Error(`Not found entity provider of type '${entityType}'`);
}

exports.createEntityProvider = createEntityProvider;
