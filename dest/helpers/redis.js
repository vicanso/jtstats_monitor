(function() {
  var client, config, logger, redis, redisConfig;

  config = require('../config');

  logger = require('./logger')(__filename);

  redisConfig = config.redis;

  redis = require('redis');

  client = redis.createClient(redisConfig.port, redisConfig.host, {
    auth_pass: redisConfig.password
  });

  client.on('ready', function() {
    return logger.info('ready');
  });

  client.on('connect', function() {
    return logger.info('connect');
  });

  client.on('error', function(args) {
    return logger.error(args);
  });

  module.exports = client;

}).call(this);
