const ProjectEntityProvider = require('./project_provider.js').ProjectEntityProvider;
const EndpointEntityProvider = require('./endpoint_provider.js').EndpointEntityProvider;

function createEntityProvider(context, entityType) {
    switch(entityType) {
        case 'project':
            return new ProjectEntityProvider(context);

        case 'endpoint':
            return new EndpointEntityProvider(context);
    }

    throw new Error(`Not found entity provider of type '${entityType}'`);
}

exports.createEntityProvider = createEntityProvider;
