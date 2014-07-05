path = require 'path'
config = require './config'
logger = require('./helpers/logger') __filename

initAppSetting = (app) ->
  app.set 'view engine', 'jade'
  app.set 'trust proxy', true
  app.set 'views', "#{__dirname}/views"

  app.locals.CONFIG =
    env : config.env
    staticUrlPrefix : config.staticUrlPrefix
  return

initMongod = ->
  uri = config.mongodbUri
  if uri
    mongodb = require './helpers/mongodb'
    mongodb.init uri
    # mongodb.initModels path.join __dirname, './models'

requestStatistics = ->
  requestTotal = 0
  tooManyReq = new Error 'too many request'
  (req, res, next) ->
    requestTotal++
    startAt = process.hrtime()
    stat =  ->
      diff = process.hrtime startAt
      ms = diff[0] * 1e3 + diff[1] * 1e-6
      requestTotal--
      data = 
        responeseTime : ms.toFixed(3)
        statusCode : res.statusCode
        url : req.url
        requestTotal : requestTotal
        contentLength : GLOBAL.parseInt res._headers['content-length']
      logger.info data
    res.on 'finish', stat
    res.on 'close', stat
    next()


initServer = ->
  initMongod()
  express = require 'express'
  app = express()
  initAppSetting app
  app.use '/healthchecks', (req, res) ->
    res.send 'success'

  if config.env == 'production'
    app.use requestStatistics() 
    app.use require('morgan')()

  timeout = require 'connect-timeout'
  app.use timeout 5000

  expressStatic = 'static'
  serveStatic = express[expressStatic]
  ###*
   * [staticHandler 静态文件处理]
   * @param  {[type]} mount      [description]
   * @param  {[type]} staticPath [description]
   * @return {[type]}            [description]
  ###
  staticHandler = (mount, staticPath) ->
    staticHandler = serveStatic staticPath
    
    hour = 3600
    hour = 0 if !process.env.NODE_ENV

    staticMaxAge = 30 * 24 * hour

    if config.env == 'development'
      jtDev = require 'jtdev'
      app.use mount, jtDev.ext.converter staticPath
      app.use mount, jtDev.stylus.parser staticPath
      app.use mount, jtDev.coffee.parser staticPath

    app.use mount, (req, res, next) ->
      res.header 'Cache-Control', "public, max-age=#{staticMaxAge}, s-maxage=#{hour}"
      staticHandler req, res, (err) ->
        return next err if err
        res.send 404, ''

  staticHandler '/static', path.join "#{__dirname}/statics"

  app.use require('morgan') 'dev' if config.env == 'development'

  app.use require('method-override')()
  bodyParser = require 'body-parser'
  app.use bodyParser.urlencoded {
    extended : false
  }
  app.use bodyParser.json()

  app.use (req, res, next) ->
    res.locals.DEBUG = true if req.param('__debug')?
    res.locals.JS_DEBUG = req.param('__jsdebug') || 0
    next()

  require('./router').init app

  app.listen config.port

  console.log "server listen on: #{config.port}"

if config.env == 'development'
  initServer()
else
  JTCluster = require 'jtcluster'
  options = 
    slaveTotal : 2
    slaveHandler : initServer
  jtCluster = new JTCluster options
  jtCluster.on 'log', (msg) ->
    console.dir msg


