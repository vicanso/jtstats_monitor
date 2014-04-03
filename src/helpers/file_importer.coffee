path = require 'path'
fs = require 'fs'
_ = require 'underscore'
moment = require 'moment'
FileImporter = require 'jtfileimporter'

isProductionMode = process.env.NODE_ENV == 'production'

# 用于记录每个template使用到哪些静态文件，方便在production下使用合并文件
componentsFile = path.join __dirname, '../components.json'
if fs.existsSync componentsFile
  try
    componentsConfig = JSON.parse fs.readFileSync componentsFile
  catch e
    console.error e
    componentsConfig = {}
else
  componentsConfig = {}

# 刷新template使用的静态文件信息
freshComponentsFile = (template, infos) ->
  tmpInfos = componentsConfig[template] || {}
  isDifference = false
  if _.keys(tmpInfos).join('') != _.keys(infos).join('')
    isDifference = true
  _.each tmpInfos, (value, key) ->
    if key != 'modifiedAt'
      if !isDifference && value.join('') != infos[key].join('')
        isDifference = true
    null
  if isDifference
    componentsConfig[template] = infos
    templateList = _.keys(componentsConfig).sort()
    tmp = {}
    _.each templateList, (template) ->
      tmp[template] = componentsConfig[template]
      null
    componentsConfig = tmp
    fs.writeFileSync componentsFile, JSON.stringify componentsConfig, null, 2


# 合并文件配置
mergeInfo = require path.join __dirname, '../merge.json'

# 由于使用seajs，部分文件是动态加载的，因此在开发过程中，添加了记录页面刚开始就立即加载到静态文件（主要为了模块化和合并文件需要）
exportTemplateInfos = {}
crc32File = path.join __dirname, '../crc32.json'
crc32List = require crc32File if fs.existsSync crc32File
importer = (req, res, next) ->
  options =     
    urlPrefix : '/static'
    path : path.join __dirname, '../statics'
  options.merge =  mergeInfo if isProductionMode
  options.crc32List = crc32List
  options.debug = true if req.query?.__debug == 'true'
  if isProductionMode
    options.hosts = ['svxs.vicanso.com']

  fileImporter = new FileImporter options

  if !isProductionMode
    # 记录通过fileImporter引入的静态文件
    fileImporter.on 'export', (template, infos) ->
      exportTemplateInfos[template] = infos
      null
  else
    # 在production环境下，为了避免seajs的动态加载（加了合并js文件加快加载速度），将dev环境下记录使用到的js、css添加
    fileImporter.on 'beforeExport', (template) ->
      fileInfos = componentsConfig[template]
      jsList = _.clone fileInfos?.jsList || []
      _.each jsList.reverse(), (file) ->
        fileImporter.importJs file, true
      cssList = _.clone fileInfos?.cssList || []
      _.each cssList.reverse(), (file) ->
        fileImporter.importCss file, true

  res.locals.fileImporter = fileImporter
  next()

# 获取页面返回seajs在页面初始化完就立即加载的静态文件
setSeajsFiles = (req, res, cbf) ->
  url = require 'url'
  body = req.body
  template = body.template
  infos = exportTemplateInfos[template] || {}
  files = _.uniq _.flatten body.files
  files = _.map files, (fileUrl) ->
    urlInfos = url.parse fileUrl
    urlInfos.pathname.replace '/static', ''
  jsList = infos.jsList
  seaDevIndex = _.indexOf jsList, '/components/sea_dev.js'
  jsList[seaDevIndex] = files if ~seaDevIndex
  infos.jsList = _.flatten jsList
  infos.modifiedAt = moment().format 'YYYY-MM-DD HH:mm:ss'
  freshComponentsFile template, infos
  cbf null, {
    msg : 'success'
  }

exports.importer = importer
exports.setSeajsFiles = setSeajsFiles