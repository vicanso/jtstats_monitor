config = require '../config'
logger = require('./logger') __filename
redisConfig = config.redis
redis = require 'redis'
client = redis.createClient redisConfig.port, redisConfig.host, {
  auth_pass : redisConfig.password
}

client.on 'ready', ->
  logger.info 'ready'

client.on 'connect', ->
  logger.info 'connect'

client.on 'error', (args) ->
  logger.error args

module.exports = client