path = require 'path'
fs = require 'fs'
async = require 'async'
crc32 = require 'buffer-crc32'
vm = require 'vm'
_ = require 'underscore'
random = Date.now()
destPath = 'dest'
srcPath = 'src'
staticsSrcPath = path.join srcPath, 'statics'
staticsDestPath = path.join destPath, 'statics'
buildPath = 'build'
nodeModulesPath = 'node_modules'


# 获取合并文件信息
getConcatFiles = ->
  JTMerge = require 'jtmerge'
  components = require path.join __dirname, 'src/components.json'
  mergeInfo = require path.join __dirname, 'src/merge.json'
  jtMerge = new JTMerge mergeInfo
  jtMerge.getMergeList components, staticsDestPath

getGitCloneConfig = (repos) ->
  config = {}
  _.each repos, (repo) ->
    config[repo] = 
      options :
        repository : "https://github.com/vicanso/#{repo}.git"
        directory : path.join nodeModulesPath, repo
  config


module.exports = (grunt) ->
  noneCopyFileExts = ['.coffee', '.js', '.styl']
  gruntConfig =
    pkg : grunt.file.readJSON 'package.json'
    clean : 
      grunt : ['node_modules/grunt-contrib-stylus/node_modules/stylus']
      dest : [destPath]
      build : [buildPath]
    gitclone : getGitCloneConfig ['jtfileimporter', 'jtmongoose', 'jtmerge', 'jtredis', 'jtrouter', 'jtdev', 'jtcluster']
    concat : 
      # 根据页面所需要的静态文件合并数据
      merge : 
        files : []
        # getConcatFiles()
    coffee : 
      # node.js的coffee直接编译到目标目录
      node : 
        expand : true
        cwd : srcPath
        src : ['**/*.coffee', '!statics/**/*.coffee']
        dest : destPath
        ext : '.js'
      # 前端用的coffee编译到build目录，后续需要做uglify
      statics :
        expand : true
        cwd : staticsSrcPath
        src : ['**/*.coffee']
        dest : buildPath
        ext : '.js'
    jshint :
      options : 
        force : true
      node :
        expand : true
        cwd : destPath
        src : ['**/*.js']
      statics :
        expand : true
        cwd : buildPath
        src : ['**/*.js']
    uglify : 
      statics :
        files : [
          {
            expand : true
            cwd : buildPath
            src : '**/*.js'
            dest : staticsDestPath
          }
          {
            expand : true
            cwd : staticsSrcPath
            src : '**/*.js'
            dest : staticsDestPath
          }
        ]
    stylus :
      bulid :
        files : [
          {
            expand : true
            cwd : srcPath
            src : ['**/*.styl']
            dest : destPath
            ext : '.css'
          }
        ]
    imagemin : 
      dynamic : 
        files : [
          {
            expand : true
            cwd : srcPath
            src : ['**/*.{png,jpg,gif}']
            dest : destPath
          }
        ]
    imageEmbed : 
      build : 
        files : [
          {
            expand : true
            cwd : destPath
            src : ['**/*.css']
            dest : destPath
          }
        ]
    cssmin : 
      build : 
        files : [
          {
            expand : true
            cwd : destPath
            src : ['**/*.css']
            dest : destPath
          }
        ]
    csslint : 
      strict : 
        files : [
          {
            expand : true
            cwd : destPath
            src : ['**/*.css']
            dest : destPath
          }
        ]
    copy :
      # 将其它不需要处理的文件复制（除coffee js styl）
      build : 
        files : [
          {
            expand : true
            cwd : srcPath
            src : ['**/*']
            dest : destPath
            filter : (file) ->
              ext = path.extname file
              if ext && ~noneCopyFileExts.indexOf ext
                false
              else
                true
          }
        ]
      # 将前端使用的js未压缩版的文件复制一份到src目录下，为了线上调试用
      js :
        files : [
          {
            expand : true
            cwd : buildPath
            src : ['**/*.js']
            dest : staticsDestPath + '/src'
          }
          {
            expand : true
            cwd : staticsSrcPath
            src : '**/*.js'
            dest : staticsDestPath + '/src'
          }
        ]
      # 初始化时，将bower的文件复制到components
      bower : 
        files : [
          {
            src : ['bower_components/html5shiv/dist/html5shiv.js']
            dest : 'src/statics/components/html5shiv.js'
          }
          {
            src : ['bower_components/jquery/jquery.js']
            dest : 'src/statics/components/jquery.js'
          }
          {
            src : ['bower_components/underscore/underscore.js']
            dest : 'src/statics/components/underscore.js'
          }
          {
            src : ['bower_components/backbone/backbone.js']
            dest : 'src/statics/components/backbone.js'
          }
          {
            src : ['bower_components/seajs/sea-debug.js']
            dest : 'src/statics/components/sea.js'
          }
          {
            src : ['bower_components/normalize-css/normalize.css']
            dest : 'src/statics/components/normalize.css'
          }
          {
            src : ['bower_components/jtlazy_load/jtlazy_load.js']
            dest : 'src/statics/components/jtlazy_load.js'
          }
          {
            src : ['bower_components/jtphoto_wall/jtphoto_wall.js']
            dest : 'src/statics/components/jtphoto_wall.js'
          }
          
        ]
    # 计算静态文件的crc32
    crc32 : 
      strict :
        files : [
          {
            expand : true
            cwd : staticsDestPath
            src : ['**/*.css', '**/*.js']
          }
        ]

  if grunt.cli.tasks[0] != 'init'
    gruntConfig.concat.merge.files = getConcatFiles()
  grunt.initConfig gruntConfig

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-image-embed'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-imagemin'
  grunt.loadNpmTasks 'grunt-contrib-csslint'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-git'

  grunt.registerMultiTask 'crc32', ->
    crc32Infos = {}
    @files.forEach (file) ->
      buf = fs.readFileSync file.src[0]
      destFile = '/' + file.dest
      crc32Infos[destFile] = crc32.unsigned buf
    fs.writeFileSync path.join(destPath, 'crc32.json'), JSON.stringify( crc32Infos, null, 2)


  grunt.registerTask 'seaConfig', ->
    crc32Buf = fs.readFileSync path.join destPath, 'crc32.json'
    crc32Infos = JSON.parse crc32Buf
    configFile = path.join staticsDestPath, 'components/config.js'
    str = fs.readFileSync configFile, 'utf8'
    _.each crc32Infos, (crc32, name) ->
      name = name.substring 1
      str = str.replace name, "#{name}?v=#{crc32}" 
    fs.writeFileSync configFile, str


  grunt.registerTask 'test', ['jshint']

  grunt.registerTask 'git', ['gitclone']

  grunt.registerTask 'init', ['clean:grunt', 'copy:bower', 'gitclone']

  grunt.registerTask 'gen', ['clean:dest', 'coffee', 'jshint', 'uglify', 'copy:build', 'stylus', 'imageEmbed', 'cssmin', 'concat:merge', 'crc32', 'copy:js', 'seaConfig', 'clean:build']

  grunt.registerTask 'default', ['gen']