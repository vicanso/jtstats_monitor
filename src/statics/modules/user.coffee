define 'user', ['jquery', 'underscore'], (require, exports, module) ->
  $ = require 'jquery'
  _ = require 'underscore'


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