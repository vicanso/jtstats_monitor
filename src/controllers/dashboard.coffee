mongodb = require '../helpers/mongodb'
config = require '../config'
async = require 'async'
module.exports = (req, res, cbf) ->
  maxAge = 600
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  async.waterfall [
    (cbf) ->
      mongodb.model('Config').find {}, cbf
    (docs, cbf) ->
      cbf null, {
        viewData :
          page : 'dashboard'
          globalVariable : 
            userConfigs : docs
      }, headerOptions
  ], cbf
