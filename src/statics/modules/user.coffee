define 'user', ['jquery', 'underscore', 'async', 'Backbone'], (require, exports, module) ->
  $ = require 'jquery'
  _ = require 'underscore'
  async = require 'async'
  Backbone = require 'Backbone'
  noop = ->

  _.extend exports, Backbone.Events



  User = Backbone.Model.extend {
    url : ->
      '/user?cache=false'
    initialize : ->
      @fetch()
  }

  user = new User()

  user.on 'change:anonymous', (model, val) ->
    status = 'logged'
    status = 'unlogged' if val
    exports.trigger 'status', status


  exports.logIn = (cbf) ->
    $('<div class="maskContainer" />').appendTo 'body'


  # exports.create = (data, cbf) ->
  #   $.ajax({
  #     url : '/user'
  #     type : 'post'
  #     dataType : 'json'
  #     contentType : 'application/json'
  #     data : JSON.stringify data
  #   }).success((res)->
  #     cbf null, res
  #   ).error (res) ->
  #     cbf res

  return