mongodb = require '../helpers/mongodb'
config = require '../config'
async = require 'async'
_ = require 'underscore'
module.exports = (req, res, cbf) ->
  maxAge = 600
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  async.waterfall [
    (cbf) ->
      mongodb.model('stats_config').find {}, cbf
    (docs, cbf) ->
      docs = _.map docs, (doc) ->
        doc = doc.toObject()
        doc.stats = _.map doc.stats, (data) ->
          delete data._id
          data
        doc
      cbf null, {
        viewData :
          page : 'configs'
          configs : docs
          globalVariable :
            configs : docs
      }, headerOptions
  ], cbf
