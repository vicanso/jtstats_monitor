_ = require 'underscore'

# pageContentHandler = require '../helpers/page_content_handler'
fileImporter = require '../helpers/file_importer'
# sync = require '../helpers/sync'
requireTree = require 'require-tree'
controllers = requireTree '../controllers'
isProductionMode = process.env.NODE_ENV == 'production'


routeInfos = [
  {
    route : '/seajs/files'
    type : 'post'
    handler : fileImporter.setSeajsFiles
  }
  {
    route : '/statistics'
    type : 'post'
    handler : controllers.statistics
  }
  {
    route : '/deploy'
    type : 'post'
    handler : controllers.deploy
  }
  {
    route : ['/stats/:key/:start', '/stats/:key/:start/:end']
    handler : controllers.stats
  }
  {
    route : '/'
    template : 'index'
    middleware : [fileImporter.importer]
    handler : controllers.home
  }
]


module.exports = routeInfos