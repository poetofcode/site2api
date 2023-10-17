const ProjectRepositiry = require('./projects.js').ProjectMiddleware;
const SnippetMiddleware = require('./snippets.js').SnippetMiddleware;
const EndpointMiddleware = require('./endpoints.js').EndpointMiddleware;

exports.ProjectMiddleware = ProjectRepositiry;
exports.SnippetMiddleware = SnippetMiddleware;
exports.EndpointMiddleware = EndpointMiddleware;
