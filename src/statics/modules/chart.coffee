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

  exports.gauge = (obj, data, option, getData) ->
    currentOptions = _.extend {
      toolbox : 
        show : true
        feature : 
          mark : 
            show : true
          restore :
            show : true
          saveAsImage :
            show : true
    }, option
    dom = $(obj).get 0
    currentOptions.series = _.map data, (item) ->
      {
        name : item.key
        type : 'gauge'
        detail : 
          formatter : '{value}'
        data : [
          {
            value : item.values[0].v
          }
        ]
      }
    myChart = echarts.init dom
    myChart.setOption currentOptions, true
    
    setInterval ->
      getData (err, data) ->
        if data
          _.each data, (item, i) ->
            currentOptions.series[i].data[0].value = item.values[0].v
          myChart.setOption currentOptions, true
    , 10 * 1000 if getData

  exports.columnFresh = (obj, data, option, getData) ->
    currentOptions = _.extend {
      toolbox : 
        show : true
        feature : 
          mark : 
            show : true
          restore :
            show : true
          saveAsImage :
            show : true
      calculable : false
      yAxis : [
        {
          type : 'value'
        }
      ]
    }, option
    currentOptions.xAxis = [
      {
        type : 'category'
        data : _.pluck data, 'key'
      }
    ]

    data = _.map data, (item) ->
      item.values[0].v
    currentOptions.series = [
      {
        type : 'bar'
        data : data
      }
    ]
    dom = $(obj).get 0
    myChart = echarts.init dom
    myChart.setOption currentOptions, true
    setInterval ->
      getData (err, data) ->
        if data
          data = _.map data, (item) ->
            item.values[0].v
          currentOptions.series[0].data = data
          myChart.setOption currentOptions, true
    , 10 * 1000 if getData

# option = {
#     title : {
#         text: '某地区蒸发量和降水量',
#         subtext: '纯属虚构'
#     },
#     tooltip : {
#         trigger: 'axis'
#     },
#     legend: {
#         data:['蒸发量','降水量']
#     },
#     toolbox: {
#         show : true,
#         feature : {
#             mark : {show: true},
#             dataView : {show: true, readOnly: false},
#             magicType : {show: true, type: ['line', 'bar']},
#             restore : {show: true},
#             saveAsImage : {show: true}
#         }
#     },
#     calculable : true,
#     xAxis : [
#         {
#             type : 'category',
#             data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
#         }
#     ],
#     yAxis : [
#         {
#             type : 'value'
#         }
#     ],
#     series : [
#         {
#             name:'蒸发量',
#             type:'bar',
#             data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
#             markPoint : {
#                 data : [
#                     {type : 'max', name: '最大值'},
#                     {type : 'min', name: '最小值'}
#                 ]
#             },
#             markLine : {
#                 data : [
#                     {type : 'average', name: '平均值'}
#                 ]
#             }
#         }
#     ]
# };
                    
                    

           


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