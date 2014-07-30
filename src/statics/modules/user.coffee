define 'user', ['jquery', 'underscore', 'async'], (require, exports, module) ->
  $ = require 'jquery'
  _ = require 'underscore'
  async = require 'async'
  noop = ->

  get = async.memoize (cbf) ->
    $.ajax({
      url : '/user?cache=false'
      dataType : 'json'  
    }).success((res)->
      cbf null, res
    ).error (res) ->
      cbf res
  get noop

  exports.isLogined = (cbf) ->


  exports.create = (data, cbf) ->
    $.ajax({
      url : '/user'
      type : 'post'
      dataType : 'json'
      contentType : 'application/json'
      data : JSON.stringify data
    }).success((res)->
      cbf null, res
    ).error (res) ->
      cbf res

  return