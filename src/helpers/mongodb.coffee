mongoose = require 'mongoose'
Schema = mongoose.Schema
_ = require 'underscore'
requireTree = require 'require-tree'
logger = require('./logger') __filename

client = null
modelDict = {}
###*
 * [init description]
 * @param  {[type]} uri     [description]
 * @param  {[type]} options =             {} [description]
 * @return {[type]}         [description]
###
module.exports.init = (uri, options = {}) ->
  return if client
  defaults = 
    db :
      native_parser : true
    server :
      poolSize : 5

  _.extend options, defaults

  client = mongoose.createConnection uri, options
  client.on 'connected', ->
    logger.info "#{uri} connected"
  client.on 'disconnected', ->
    logger.info "#{uri} disconnected"


###*
 * [model 获取mongoose的model]
 * @param  {[type]} collection [description]
 * @return {[type]}      [description]
###
module.exports.model = (collection) ->
  throw new Error 'the db is not init!' if !client
  if modelDict[collection]
    modelDict[collection]
  else
    schema = new Schema {}, {
      safe : false
      strict : false
      collection : collection
    }
    schema.index [
      {
        key : 1
      }
      {
        key : 1
        date : 1
      }
    ]
    model = client.model collection, schema
    modelDict[collection] = model
    model


###*
 * [getModel 获取model]
 * @param  {String} collection
 * @return {[type]}
###
getModel = (collection) ->
    
  schema = new Schema {}, {
    safe : false
    strict : false
    collection : collection
  }
  schema.index [
    {
      key : 1
    }
    {
      key : 1
      date : 1
    }
  ]
  model = client.model collection, schema
  modelDict[collection] = model
  model