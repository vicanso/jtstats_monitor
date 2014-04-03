JTMongoose = require 'jtmongoose'
client = null
path = require 'path'
logger = require('./logger') __filename
modelDict = {}

# statistics = require './statistics'

###*
 * init 初始化数据库，自动初始化models下面的schema
 * @param  {[type]} setting [description]
 * @return {[type]}         [description]
###
module.exports.init = (setting) ->
  options =
    db : 
      native_parser : true
    server :
      poolSize : 5
  client = new JTMongoose setting.uri, options

getModel = (collection) ->
  model = modelDict[collection]
  if !model
    schema = client.schema collection, {}, {
      safe : false
      strict : false
      collection : collection
    }
    model = client.model collection, schema
    modelDict[collection] = model
  model

module.exports.find = (collection, args...) ->
  model = getModel collection
  model.find.apply model, args

module.exports.findOne = (collection, args...) ->
  model = getModel collection
  model.findOne.apply model, args