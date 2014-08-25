(function() {
  define('user', ['jquery', 'underscore', 'async', 'Backbone'], function(require, exports, module) {
    var $, Backbone, User, async, noop, user, _;
    $ = require('jquery');
    _ = require('underscore');
    async = require('async');
    Backbone = require('Backbone');
    noop = function() {};
    _.extend(exports, Backbone.Events);
    User = Backbone.Model.extend({
      defaults: {
        anonymous: true
      },
      url: function() {
        return '/user?cache=false';
      },
      initialize: function() {
        return this.fetch();
      }
    });
    user = new User();
    user.on('change:anonymous', function(model, val) {
      var status;
      status = 'logged';
      if (val) {
        status = 'unlogged';
      }
      if (status === 'logged') {
        user.set('id', 'vicanso');
      }
      return exports.trigger('status', status);
    });
    exports.isLogedIn = function() {
      return !user.get('anonymous');
    };
    exports.logOut = function() {
      return user.destroy({
        success: function(model, res) {
          user.set('name', '');
          user.set('id', '');
          return _.each(res, function(val, key) {
            return user.set(key, val);
          });
        },
        error: function() {
          return console.dir('error');
        }
      });
    };
    exports.logIn = function() {
      var dlg, logInDialogHtml, mask;
      mask = $('<div class="maskContainer" />').appendTo('body');
      logInDialogHtml = '<div class="logInDialog">' + '<div class="panel panel-default">' + '<div class="panel-heading">' + '<h3 class="panel-title"><a href="javascript:;" class="glyphicon glyphicon-remove close"></a>登录</h3>' + '</div>' + '</div>' + '<div class="panel-body">' + '<input type="text" class="form-control user" autofocus placeholder="用户名" />' + '<input type="password" class="form-control password" autofocus placeholder="密码" />' + '<div class="alert hidden"></div>' + '<div class="row">' + '<div class="col-xs-6"><a href="javascript:;" class="btn btn-success register">注册</a></div>' + '<div class="col-xs-6"><a href="javascript:;" class="btn btn-primary logIn">登录</a></div>' + '</div>' + '</div>' + '</div>';
      dlg = $(logInDialogHtml).appendTo('body');
      return dlg.on('click', '.close, .logIn, .register', function() {
        var alertObj, obj, password, passwordInput, type, userInput, userName;
        obj = $(this);
        if (obj.hasClass('logIn') || obj.hasClass('register')) {
          userInput = dlg.find('input.user');
          userName = userInput.val().trim();
          if (!userName) {
            userInput.focus();
            return;
          }
          passwordInput = dlg.find('input.password');
          password = passwordInput.val().trim();
          if (!password) {
            passwordInput.focus();
            return;
          }
          alertObj = dlg.find('.alert');
          alertObj.removeClass('alert-warning hidden');
          alertObj.addClass('alert-info');
          alertObj.text('正在提交中，请稍候...');
          type = 'logIn';
          if (obj.hasClass('register')) {
            type = 'register';
          }
          return seajs.use('crypto', function(crypto) {
            var pwd;
            user.set('type', type);
            pwd = crypto.SHA1(password).toString();
            if (type === 'logIn') {
              pwd = crypto.SHA1("" + pwd + "_" + (user.get('hash'))).toString();
            }
            user.set('pwd', pwd);
            user.set('name', userName);
            return user.save({}, {
              error: function() {
                alertObj.removeClass('alert-info').addClass('alert-warning');
                if (type === 'register') {
                  return alertObj.text('注册失败！');
                } else {
                  return alertObj.text('登录失败！');
                }
              },
              success: function(model, res) {
                _.each(res, function(v, k) {
                  return model.set(k, v);
                });
                dlg.remove();
                return mask.remove();
              }
            });
          });
        } else {
          dlg.remove();
          return mask.remove();
        }
      });
    };
    exports.get = function(key) {
      return user.get(key);
    };
  });

}).call(this);
