mongodb = require '../helpers/mongodb'
config = require '../config'
async = require 'async'
moment = require 'moment'
_ = require 'underscore'
logger = require('../helpers/logger') __filename

module.exports = (req, res, cbf) ->
  Config = mongodb.model 'Config'
  data =  req.body
  async.waterfall [
    (cbf) ->
      Config.findOne {name : data.name}, cbf
    (doc, cbf) ->
      if doc
        err = new Error 'th name has exists'
        cbf err
      else
        new Config(data).save cbf
  ], cbf