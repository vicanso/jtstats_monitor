define 'user', ['jquery', 'underscore', 'async', 'Backbone'], (require, exports, module) ->
  $ = require 'jquery'
  _ = require 'underscore'
  async = require 'async'
  Backbone = require 'Backbone'
  noop = ->

  _.extend exports, Backbone.Events



  User = Backbone.Model.extend {
    defaults : 
      anonymous : true
    url : ->
      '/user?cache=false'
    initialize : ->
      @fetch()
  }

  user = new User()

  user.on 'change:anonymous', (model, val) ->
    status = 'logged'
    status = 'unlogged' if val
    user.set 'id', 'vicanso' if status == 'logged'
    exports.trigger 'status', status

  exports.isLogedIn = ->
    !user.get 'anonymous'

  exports.logOut = ->
    user.destroy {
      success : (model, res) ->
        user.set 'name', ''
        user.set 'id', ''
        _.each res, (val, key) ->
          user.set key, val
      error : ->
        console.dir 'error'
    }

  exports.logIn = ->
    mask = $('<div class="maskContainer" />').appendTo 'body'
    logInDialogHtml = '<div class="logInDialog">' +
      '<div class="panel panel-default">' +
        '<div class="panel-heading">' +
          '<h3 class="panel-title"><a href="javascript:;" class="glyphicon glyphicon-remove close"></a>登录</h3>' +
        '</div>' +
      '</div>' +
      '<div class="panel-body">' +
        '<input type="text" class="form-control user" autofocus placeholder="用户名" />' +
        '<input type="password" class="form-control password" autofocus placeholder="密码" />' +
        '<div class="alert hidden"></div>' +
        '<div class="row">' +
          '<div class="col-xs-6"><a href="javascript:;" class="btn btn-success register">注册</a></div>' +
          '<div class="col-xs-6"><a href="javascript:;" class="btn btn-primary logIn">登录</a></div>' +
        '</div>' +
      '</div>' +
    '</div>'
    dlg = $(logInDialogHtml).appendTo 'body'
    dlg.on 'click', '.close, .logIn, .register', ->
      obj = $ @
      if obj.hasClass('logIn') || obj.hasClass 'register'
        userInput = dlg.find 'input.user'
        userName = userInput.val().trim()
        if !userName
          userInput.focus()
          return
        passwordInput = dlg.find 'input.password'
        password = passwordInput.val().trim()
        if !password
          passwordInput.focus()
          return
        alertObj = dlg.find '.alert'
        alertObj.removeClass 'alert-warning hidden'
        alertObj.addClass 'alert-info'
        alertObj.text '正在提交中，请稍候...'
        type = 'logIn'
        type = 'register' if obj.hasClass 'register'
        seajs.use 'crypto', (crypto) ->
          user.set 'type', type

          pwd = crypto.SHA1(password).toString()
          pwd = crypto.SHA1("#{pwd}_#{user.get('hash')}").toString() if type == 'logIn'
          user.set 'pwd', pwd
          user.set 'name', userName
          user.save {}, {
            error : ->
              alertObj.removeClass('alert-info').addClass 'alert-warning'
              if type == 'register'
                alertObj.text '注册失败！'
              else
                alertObj.text '登录失败！'
            success : (model, res) ->
              _.each res, (v, k) ->
                model.set k, v
              dlg.remove()
              mask.remove() 
          }
      else
        dlg.remove()
        mask.remove()
  exports.get = (key) ->
    user.get key

  return