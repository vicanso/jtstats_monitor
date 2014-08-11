mongodb = require '../helpers/mongodb'
config = require '../config'
async = require 'async'
_ = require 'underscore'
Set = mongodb.model 'stats_set'
User = mongodb.model 'stats_user'
Config = mongodb.model 'stats_config'

add = (req, cbf) ->
  data = req.body
  user = req.session?.user
  if !user.name
    return cbf new Error 'is not login'
  data.creator = user.name
  async.waterfall [
    (cbf) ->
      Set.findOne {name : data.name}, cbf
    (doc, cbf) ->
      if doc
        cbf new Error 'the name is exists'
      else
        new Set(data).save cbf
    (doc, numberAffected, cbf) ->
      update =
        '$push' :
          'sets' : doc._id
      conditions = 
        name : user.name
      User.findOneAndUpdate conditions, update, cbf
    (doc, cbf) ->
      user.sets = doc.sets
      cbf null, {
        message : 'success'
      }
  ], cbf

get = (req, cbf) ->
  maxAge = 600
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  id = req.param 'id'
  async.waterfall [
    (cbf) ->
      Set.findById id, cbf
    (doc, cbf) ->
      funcs = _.map _.pluck(doc.configs, 'id'), (id) ->
        (cbf) ->
          Config.findById id, cbf
      async.parallel funcs, (err, docs) ->
        if err
          cbf err
        else
          data = doc.toObject()
          _.each docs, (tmp, i) ->
            data.configs[i] = _.extend tmp.toObject(), data.configs[i]
          cbf null, data, headerOptions
      # cbf null, doc, headerOptions
  ], cbf

module.exports = (req, res, cbf) ->
  switch req.method
    when 'GET'
      get req, cbf
    when 'POST'
      add req, cbf

