const ProjectEntityProvider = require('./project_provider.js').ProjectEntityProvider;
const EndpointEntityProvider = require('./endpoint_provider.js').EndpointEntityProvider;
const DbExportEntityProvider = require('./dbexport_provider.js').DbExportEntityProvider;

function createEntityProvider(context, entityType, token) {
    switch(entityType) {
        case 'project':
            return new ProjectEntityProvider(context, token);

        case 'endpoint':
            return new EndpointEntityProvider(context, token);

        case 'dbexport':
        	return new DbExportEntityProvider(context, token);
    }

    throw new Error(`Not found entity provider of type '${entityType}'`);
}

exports.createEntityProvider = createEntityProvider;
