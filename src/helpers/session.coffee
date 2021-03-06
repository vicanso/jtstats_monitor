config = require '../config'
sessionConfig = config.session
cookieParser = require('cookie-parser') sessionConfig.key
expressSession = require 'express-session'
RedisStore = require('connect-redis') expressSession
redis = require './redis'

storeOptions =
  client : redis
  ttl : sessionConfig.ttl
session = expressSession {
  resave : false
  saveUninitialized : false
  secret : sessionConfig.secret
  key : sessionConfig.key
  store : new RedisStore storeOptions
}

module.exports = (req, res, next) ->
  cookieParser req, res, ->
    session req, res, next