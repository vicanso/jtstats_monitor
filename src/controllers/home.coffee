mongodb = require '../helpers/mongodb'
config = require '../config'
async = require 'async'
module.exports = (req, res, cbf) ->
  maxAge = 600
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  async.parallel {
    collections : (cbf) ->
      mongodb.getCollectionNames cbf
  }, (err, result) ->
    if err
      cbf err
    else
      cbf null, {
        viewData :
          globalVariable : 
            collections : result.collections
      }, headerOptions