(function() {
  var FileImporter, JTMerger, addImporter, components, config, controllers, crc32Config, merger, requireTree, routeInfos, router, session;

  router = require('./helpers/router');

  config = require('./config');

  requireTree = require('require-tree');

  controllers = requireTree('./controllers');

  FileImporter = require('jtfileimporter');

  JTMerger = require('jtmerger');

  if (config.env !== 'development') {
    crc32Config = require('./crc32.json');
    merger = new JTMerger(require('./merge.json'));
    components = require('./components.json');
  }

  session = require('./helpers/session');

  addImporter = function(req, res, next) {
    var currentTemplateComponents, fileImporter, template;
    fileImporter = new FileImporter(merger);
    if (res.locals.DEBUG) {
      fileImporter.debug(true);
    }
    template = res.locals.TEMPLATE;
    if (template && components) {
      currentTemplateComponents = components[template];
      fileImporter.importJs(currentTemplateComponents != null ? currentTemplateComponents.js : void 0);
      fileImporter.importCss(currentTemplateComponents != null ? currentTemplateComponents.css : void 0);
    }
    if (crc32Config) {
      fileImporter.version(crc32Config);
    }
    fileImporter.prefix(config.staticUrlPrefix);
    res.locals.fileImporter = fileImporter;
    return next();
  };

  routeInfos = [
    {
      route: '/seajs/files',
      type: 'post',
      handler: controllers.seajs
    }, {
      route: ['/', '/jtstats'],
      handler: controllers.jtstats,
      middleware: [addImporter],
      template: 'jtstats'
    }, {
      route: '/add',
      handler: controllers.add,
      middleware: [addImporter],
      template: 'add'
    }, {
      route: '/dashboard',
      handler: controllers.dashboard,
      middleware: [addImporter, session],
      template: 'dashboard'
    }, {
      route: '/stats',
      handler: controllers.stats
    }, {
      route: '/collection/:collection/keys',
      handler: controllers.collection.getKeys
    }, {
      route: '/configs',
      handler: controllers.configs,
      middleware: [addImporter],
      template: 'configs'
    }, {
      route: '/config',
      handler: controllers.config
    }, {
      route: '/config',
      type: 'post',
      middleware: [session],
      handler: controllers.config
    }, {
      route: '/set',
      type: 'post',
      middleware: [session],
      handler: controllers.set
    }, {
      route: '/set/:id',
      handler: controllers.set
    }, {
      route: '/user',
      type: 'all',
      middleware: [session],
      handler: controllers.user
    }
  ];

  module.exports.init = function(app) {
    return router.init(app, routeInfos);
  };

}).call(this);
