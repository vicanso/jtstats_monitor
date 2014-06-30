config = require '../config'
redisConfig = config.redis
redis = require 'redis'
client = redis.createClient redisConfig.port, redisConfig.host, {
  auth_pass : redisConfig.password
}

client.on 'ready', ->
  console.dir 'ready'

client.on 'connect', ->
  console.dir 'connect'

client.on 'error', ->
  console.dir 'error'

module.exports = client