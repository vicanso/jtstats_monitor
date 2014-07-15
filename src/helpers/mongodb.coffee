mongoose = require 'mongoose'
Schema = mongoose.Schema
_ = require 'underscore'
requireTree = require 'require-tree'
logger = require('./logger') __filename
path = require 'path'

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
  @initModels path.join __dirname, '../models'



###*
 * [initModels 初始化models]
 * @param  {[type]} modelPath [description]
 * @return {[type]}           [description]
###
module.exports.initModels = (modelPath) ->
  throw new Error 'the db is not init!' if !client
  models = requireTree modelPath
  _.each models, (model, name) ->
    name = model.name || (name.charAt(0).toUpperCase() + name.substring 1)
    schema = new Schema model.schema, model.options
    if model.indexes
      _.each model.indexes, (indexOptions) ->
        schema.index.apply schema, indexOptions
    modelDict[name] = client.model name, schema


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

module.exports.getCollectionNames = (cbf) ->
  return cbf new Error 'the db is not init!' if !client
  client.db.collectionNames (err, names) ->
    if err
      cbf err
    else
      result = []
      _.each names, (info) ->
        infos = info.name.split '.'
        infos.shift()
        result.push infos.join('.') if _.first(infos) != 'system'
      cbf null, result


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

