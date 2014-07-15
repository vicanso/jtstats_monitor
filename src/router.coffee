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

# session = require './helpers/session'

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
    route : '/config'
    type : 'post'
    handler : controllers.config
  }
]






module.exports.init = (app) ->
  router.init app, routeInfos