(function() {
  var RedisStore, config, cookieParser, expressSession, redis, session, sessionConfig, storeOptions;

  config = require('../config');

  sessionConfig = config.session;

  cookieParser = require('cookie-parser')(sessionConfig.key);

  expressSession = require('express-session');

  RedisStore = require('connect-redis')(expressSession);

  redis = require('./redis');

  storeOptions = {
    client: redis,
    ttl: sessionConfig.ttl
  };

  session = expressSession({
    resave: false,
    saveUninitialized: false,
    secret: sessionConfig.secret,
    key: sessionConfig.key,
    store: new RedisStore(storeOptions)
  });

  module.exports = function(req, res, next) {
    return cookieParser(req, res, function() {
      return session(req, res, next);
    });
  };

}).call(this);
