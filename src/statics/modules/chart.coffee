define 'chart', ['jquery', 'underscore'], (require, exports, module) ->
  _ = require 'underscore'
  $ = require 'jquery'

  defaultStockOptions =
    title :
      text : 'stats'
    chart :
      animation : false
    yAxis :
      min : 0
    legend :
      enabled : true
    rangeSelector :
      selected : 1
      inputEnabled : false
      buttonTheme : 
        stroke : 'none'
        r : 10
        style :
          color : '#039'
        states :
          select : 
            fill : '#bf0b23'
      buttons : [
        {
          type : 'minute'
          count : 30
          text : '30m'
        }
        {
          type : 'minute'
          count : 120
          text : '2h'
        }
        {
          type : 'minute'
          count : 360
          text : '6h'
        }
        {
          type : 'minute'
          count : 720
          text : '12h'
        }
        {
          type : 'day'
          count : 1
          text : '1d'
        }
        {
          type : 'all'
          text : 'all'
        }
      ]

  ###*
   * [sum description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
  ###
  sum = (data) ->
    _.reduce data, (memo, num) ->
      memo + num
    , 0
  ###*
   * [average description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
  ###
  average = (data) ->
    total = sum data
    Math.round total / data.length

  covertData = (res, type = 'spline') ->
    _.map res, (data) ->
      arr = _.map data.values, (point) ->
        [point.t * 1000, point.v]
      {
        name : data.key
        data : arr
        type : type
      }
  exports.line = (obj, res, options = {}) ->
    jqObj = $ obj
    options = _.extend options, defaultStockOptions
    options.series = covertData res  
    jqObj.highcharts 'StockChart', options
  exports.column = (obj, res, options = {}) ->
    jqObj = $ obj
    options = _.extend options, defaultStockOptions
    if options.navigator
      options.navigator.enabled = false if options.navigator.enabled?
    else
      options.navigator = 
        enabled : false
    options.series = covertData res, 'column'
    jqObj.highcharts 'StockChart', options


  exports.pie = (obj, res, options = {}) ->
    jqObj = $ obj
    data = _.map res, (data) ->
      values = _.pluck data.values, 'v'
      switch data.type
        when 'counter' then value = sum values
        when 'average' then value = average values
        when 'gauge' then value = _.last values
      [data.key, value]
    options = _.extend {
      plotOptions :
        pie : 
          allowPointSelect : true
          cursor : 'pointer'
          dataLabels :
            enabled : false
          showInLegend : true
    }, options
    console.dir data
    options.series = [
      {
        type : 'pie'
        data : data
      }
    ]
    obj.highcharts options
  return