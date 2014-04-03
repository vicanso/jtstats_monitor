module.exports.getENV = ->
  process.env.NODE_ENV || 'development'

module.exports.getMongodbConfig = ->
  {
    dbName : 'stats'
    uri : 'mongodb://vicanso:123456@localhost:10020/stats'
  }
