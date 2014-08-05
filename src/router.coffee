router = require './helpers/router'
config = require './config'
requireTree = require 'require-tree'
controllers = requireTree './controllers'
FileImporter = require 'jtfileimporter'
JTMerger = require 'jtmerger'
if config.env != 'development'
  crc32Config = require './crc32.json'
  merger = new JTMerger require './merge.json'
  components = require './components.json'

session = require './helpers/session'

addImporter = (req, res, next) ->
  fileImporter = new FileImporter merger
  fileImporter.debug true if res.locals.DEBUG
  template = res.locals.TEMPLATE
  if template && components
    currentTemplateComponents = components[template]
    fileImporter.importJs currentTemplateComponents?.js
    fileImporter.importCss currentTemplateComponents?.css

  fileImporter.version crc32Config if crc32Config
  fileImporter.prefix config.staticUrlPrefix
  res.locals.fileImporter = fileImporter
  next()

routeInfos = [
  {
    route : '/seajs/files'
    type : 'post'
    handler : controllers.seajs
  }

  {
    route : '/jtstats'
    handler : controllers.jtstats
    middleware : [addImporter]
    template : 'jtstats'
  }
  {
    route : '/add'
    handler : controllers.add
    middleware : [addImporter]
    template : 'add'
  }
  {
    route : '/dashboard'
    handler : controllers.dashboard
    middleware : [addImporter, session]
    template : 'dashboard'
  }


  {
    route : '/'
    handler : controllers.home
    middleware : [addImporter]
    template : 'home'
  }
  {
    route : '/stats'
    handler : controllers.stats
  }
  {
    route : '/collection/:collection/keys'
    handler : controllers.collection.getKeys
  }
  {
    route : '/configs'
    handler : controllers.configs
    middleware : [addImporter]
    template : 'configs'
  }
  {
    route : '/config'
    handler : controllers.config
  }
  {
    route : '/config'
    type : 'post'
    middleware : [session]
    handler : controllers.config
  }
  {
    route : '/user'
    type : 'all'
    middleware : [session]
    handler : controllers.user
  }
]






module.exports.init = (app) ->
  router.init app, routeInfos