const hbsHelpers = {
  
  ifeq: function(a, b, options){
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  
  bar: function(){
    return "BAR!";
  },

  json: function(context) {
    return JSON.stringify(context);
  },

  url: function(path) {
    const basePath = context.config.subfolder || '';
    const cleanPath = path && path.startsWith('/') ? path : '/' + path;

    console.log(`url-helper, cleanPath: ${cleanPath}, basePath: ${basePath}, result: ${basePath + cleanPath}`);
    
    return basePath + cleanPath;
  },

  static: function(path) {
    const basePath = context.config.subfolder || '';
    const cleanPath = path && path.startsWith('/') ? path : '/' + path;
    const version = this.staticVersion || Date.now();
    return basePath + cleanPath + '?v=' + version;
  },

  apiUrl: function(path) {
    const basePath = context.config.subfolder || '';
    const cleanPath = path && path.startsWith('/') ? path : '/' + path;
    return basePath + '/api/v1' + cleanPath;
  },

  active: function(currentUrl, targetUrl) {
    return currentUrl === targetUrl ? 'active' : '';
  },

  path: function(path, options) {
    const basePath = options.hash.basePath || context.config.subfolder || '';
    const cleanPath = path && path.startsWith('/') ? path : '/' + path;
    return basePath + cleanPath;
  },

  concat: function() {
      let result = '';
      for (let i = 0; i < arguments.length - 1; i++) {
          result += arguments[i];
      }
      return result;
  }

};

let context = '';

function setContext(contextParam) {
    context = contextParam;
    global.context = contextParam; // Чтобы хелперы могли достучаться
}

module.exports = {
  hbsHelpers: hbsHelpers,
  setContext: setContext
};