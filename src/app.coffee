program = require 'commander'
do ->
  program.version('0.0.1')
  .option('-p, --port <n>', 'listen port', parseInt)
  .option('--log <n>', 'the log file')
  .parse process.argv

_ = require 'underscore'
jtRouter = require 'jtrouter'
path = require 'path'
fs = require 'fs'
config = require './config'
# setting = require './setting'
logger = require('./helpers/logger') __filename






initAppSetting = (app) ->
  app.set 'view engine', 'jade'
  app.set 'trust proxy', true
  app.set 'views', "#{__dirname}/views"
  app.locals.title = '测试代码'
  app.locals.ENV = config.getENV()
  # app.locals.isProductionMode = isProductionMode
  app.locals.LOCAL =
    staticUrlPrefix : getStaticUrlPrefix
  app

getStaticUrlPrefix = ->
  if config.getENV() == 'production'
    "http://svxs.vicanso.com"
  else
    ''



initMongodb = ->
  dbConfig = config.getMongodbConfig()
  require('./helpers/mongodb').init dbConfig if dbConfig

initServer = ->
  express = require 'express'
  app = express()

  initAppSetting app

  # 心跳检查
  app.use '/healthchecks', (req, res) ->
    res.send 'success'


  staticPath = path.join "#{__dirname}/statics"
  staticMount = '/static'
  if app.get('env') == 'development'
    app.use express.logger 'dev'
    jtDev = require 'jtdev'
    # 后缀转化，如请求a.js，先判断a.js是否存在，不存在则将请求url修改为a.coffee，js --> coffee、css --> styl
    app.use staticMount, jtDev.ext.converter staticPath
    # stylus编译为相应的css
    app.use staticMount, jtDev.stylus.parser staticPath
    # coffee编译为相应的js
    app.use staticMount, jtDev.coffee.parser staticPath
  else
    app.use express.logger {
      format : 'tiny'
      stream : 
        write : (str) ->
          logger.info str.trim()
    }


  # 静态文件处理
  hour = 3600
  staticMaxAge = 30 * 24 * hour
  staticHanlder = express.static staticPath
  app.use staticMount, (req, res, next) ->
    res.header 'Cache-Control', "public, max-age=#{staticMaxAge}, s-maxage=#{hour}"
    staticHanlder req, res, next


  app.use express.methodOverride()
  app.use express.bodyParser()



  routes = require './routes'
  jtRouter.initRoutes app, routes if routes

  app.use app.router


  app.use require './controllers/error'


  port = program.port || 10000
  app.listen port

  logger.info "server start on port:#{port}"

initMongodb()

if config.getENV() == 'development'
  initServer()
else
  JTCluster = require 'jtcluster'
  jtCluster = new JTCluster()
  options = 
    restartOnError : true
    slaveHandler : initServer
  jtCluster.start options
  jtClusterLogger = require('./helpers/logger') 'jtcluster'
  jtCluster.on 'log', (data) ->
    jtClusterLogger.info data

