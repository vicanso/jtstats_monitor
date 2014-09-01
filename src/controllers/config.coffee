mongodb = require '../helpers/mongodb'
config = require '../config'
async = require 'async'
moment = require 'moment'
_ = require 'underscore'
logger = require('../helpers/logger') __filename

module.exports = (req, res, cbf) ->
  Config = mongodb.model 'stats_config'
  method = req.method

  save = (data, name, cbf) ->
    async.waterfall [
      (cbf) ->
        Config.findOne {name : data.name}, cbf
      (doc, cbf) ->
        if doc
          err = new Error 'the name has exists'
          cbf err
        else
          data.creator = name
          new Config(data).save (err, doc) ->
            cbf err, doc
      (doc, cbf) ->

        cbf null, doc, {
          'Cache-Control' : 'no-cache, no-store'
        }
    ], cbf

  get = (query, cbf) ->
    if !query
      cbf new Error 'query can not be null'
      return
    async.waterfall [
      (cbf) ->
        Config.findOne query, cbf
      (data, cbf) ->
        maxAge = 60
        maxAge = 0 if config.env == 'development'
        headerOptions = 
          'Cache-Control' : "public, max-age=#{maxAge}"
        cbf null, data, headerOptions
    ], cbf
    

  switch method
    when 'POST'
      user = req.session?.user
      if user?.name
        save req.body, user.name, cbf
      else
        cbf new Error 'user is not log in'
    when 'GET'
      get req.query, cbf