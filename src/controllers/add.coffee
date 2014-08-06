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
      !~collection.indexOf 'stats_'
    if err
      cbf err
    else
      cbf null, {
        viewData :
          page : 'add'
          chartTypes : [
            {
              type : 'line'
              name : '线状图'
            }
            {
              type : 'column'
              name : '柱状图'
            }
            {
              type : 'pie'
              name : '饼图'
            }
            {
              type : 'gauge'
              name : '仪表盘'
            }
          ]
          globalVariable :
            collections : collections
      }, headerOptions