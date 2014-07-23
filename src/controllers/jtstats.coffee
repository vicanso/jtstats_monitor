mongodb = require '../helpers/mongodb'
config = require '../config'
async = require 'async'
_ = require 'underscore'
module.exports = (req, res, cbf) ->
  maxAge = 600
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  async.parallel {
    collections : (cbf) ->
      mongodb.getCollectionNames cbf
  }, (err, result) ->
    collections = _.filter result.collections, (collection) ->
      collection != 'users' && collection != 'configs'
    if err
      cbf err
    else
      cbf null, {
        viewData :
          page : 'jtstats'
          globalVariable : 
            collections : collections
      }, headerOptions