define 'chart', ['jquery', 'underscore', 'echarts', 'moment', 'stats'], (require, exports, module) ->
  _ = require 'underscore'
  $ = require 'jquery'
  echarts = require 'echarts'
  moment = require 'moment'

  daySeconds = 24 * 3600


  defaultOption = 
    tooltip :
      trigger : 'axis'
    calculable : true
    toolbox :
      show : true
      feature :
        mark :
          show : true
        dataView : 
          show : true
        magicType : 
          show :true
          type : ['line', 'bar']
        restore : 
          show : true
        saveAsImage : 
          show : true
    yAxis : [
      {
        type : 'value'
      }
    ]


  defaultPieOption =
    tooltip :
      trigger : 'item'
      formatter : "{a} <br/>{b} : {c} ({d}%)"
    toolbox :
      show : true
      feature :
        mark :
          show : true
        dataView :
          show : true
        restore :
          show : true
        saveAsImage :
          show : true
      calculable : true


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



  mergeTimeList = (data) -> 
    tmpArrList = _.map data, (item) ->
      _.pluck item.values, 't'
    result = tmpArrList.shift()
    _.each tmpArrList, (arr) ->
      _.each arr, (time, i) ->
        index = _.sortedIndex result, time
        if result[index] != time
          result.splice index, 0, time
    result

  convertData = (data, timeList) ->
    valuesList = _.pluck data, 'values'
    result = []
    for i in [0...valuesList.length]
      result.push []
    _.each timeList, (time) ->
      _.each valuesList, (values, i) ->
        if values[0]?.t == time
          value = values.shift()
          result[i].push value.v
        else
          result[i].push 0
    result
  formatTime = (timeList, interval) ->
    formatStr = 'YYYY-MM-DD HH:mm:ss'
    if interval
      if !(interval % daySeconds)
        formatStr = 'YYYY-MM-DD'
      else if !(interval % 3600)
        formatStr = 'YYYY-MM-DD HH'
      else if !(interval % 60)
        formatStr = 'YYYY-MM-DD HH:mm'
    _.map timeList, (time) ->
      moment(time * 1000).format formatStr
  getDataZoom = (total) ->
    if total > 30
      {
        show : true
        realtime : true
        start : 80
        end : 100
      }
    else
      null

  showChart = (dom, data, type, option) ->
    return if !data?.length
    timeList = mergeTimeList data
    values = convertData data, timeList
    timeList = formatTime timeList, option?.interval

    series = _.map data, (item, i) ->
      {
        name : item.key
        type : type
        data : values[i]
      }
    currentOptions = _.extend {}, defaultOption, {
      legend :
        data : _.pluck data, 'key'
      dataZoom : getDataZoom timeList.length
      xAxis : [
        {
          type : 'category'
          boundaryGap : false
          data : timeList
        }
      ]
      series : series
    }, option
    myChart = echarts.init dom
    myChart.setOption currentOptions, true
  exports.line = (obj, data, option) ->
    showChart $(obj).get(0), data, 'line', option
  exports.column = (obj, data, option) ->
    showChart $(obj).get(0), data, 'bar', option


  exports.pie = (obj, res, option) ->
    data = _.map res, (data) ->
      values = _.pluck data.values, 'v'
      switch data.type
        when 'counter' then value = sum values
        when 'average' then value = average values
        when 'gauge' then value = _.last values
      {
        name : data.key
        value : value
      }
    option = _.extend {}, defaultPieOption, {
      legend :
        data : _.pluck data, 'name'
      series : [
        {
          name : option?.title?.text
          type : 'pie'
          data : data
        }
      ]
    }, option
    myChart = echarts.init $(obj).get(0)
    myChart.setOption option, true
  return