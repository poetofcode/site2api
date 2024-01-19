const ProjectRepositiry = require('./projects.js').ProjectRepository;
const SnippetRepository = require('./snippets.js').SnippetRepository;
const EndpointRepository = require('./endpoints.js').EndpointRepository;
const SessionRepository = require('./sessions.js').SessionRepository;

exports.ProjectRepository = ProjectRepositiry;
exports.SnippetRepository = SnippetRepository;
exports.EndpointRepository = EndpointRepository;
exports.SessionRepository = SessionRepository;
