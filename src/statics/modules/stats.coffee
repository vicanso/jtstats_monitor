define 'stats', ['jquery', 'underscore'], (require, exports, module) ->
  $ = require 'jquery'
  _ = require 'underscore'

  defaultInterval = 60

  ###*
   * [getChartData description]
   * @param  {[type]} options 用于配置获取的数据参数
   * category： 对应于mongodb的collection
   * 
   * date：用于配置获取的时间段，可选，若为空则取当天数据
   * {
   *   start : '开始日期（YYYY-MM-DD）或者 -1, -2表示多少天之前'
   *   end : '结束日期（YYYY-MM-DD）'
   * }
   * 
   * key：用于标记获取的记录，有以下的配置方式
   * 1、{
   *   value : 'pv'
   *   type : 'reg' //可选，若为'reg'则是正式表达式配置，否则全配置
   * }
   * 2、[
   *   {
   *     value : 'pv'
   *   }
   *   {
   *     value : 'pv.category'
   *   }
   * ]
   *
   * point：用于配置点间隔
   * {
   *   interval : 60 // 60s，尽量使用和stats收集记录的配置时间的倍数，若不传该参数，后台获取数据默认以60s为间隔
   * }
   *
   * fill：是否填充未收集到数据的间隔，true or false，默认为false
   * @param  {[type]} cbf     [description]
   * @return {[type]}         [description]
  ###
  exports.getChartData = (options, cbf) ->
    if !options.interval
      options.interval = defaultInterval
    $.ajax({
      url : '/stats'
      dataType : 'json'
      data : options 
    }).success((res)->
      cbf null, res
    ).error cbf

  exports.setDefaultInterval = (interval) ->
    defaultInterval = interval
  exports.getDefaultInterval = ->
    defaultInterval


  return