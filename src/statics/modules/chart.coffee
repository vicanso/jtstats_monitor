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

  # covertData = (res, type = 'spline') ->
  #   _.map res, (data) ->
  #     arr = _.map data.values, (point) ->
  #       [point.t * 1000, point.v]
  #     {
  #       name : data.key
  #       data : arr
  #       type : type
  #     }

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
        start : 0
        end : 30
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


  exports.pie = (obj, res) ->
    # jqObj = $ obj
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

    option =
      title :
        text : 'pie测试'
        x : 'center'
      tooltip :
        trigger : 'item'
        formatter : "{a} <br/>{b} : {c} ({d}%)"
      legend :
        orient : 'vertical'
        x : 'left'
        data : _.pluck data, 'name'
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
      series : [
        {
          name : 'pie测试'
          type : 'pie'
          data : data
        }
      ]
    myChart = echarts.init $(obj).get(0)
    myChart.setOption option, true
#     series : [
#         {
#             name:'访问来源',
#             type:'pie',
#             radius : '55%',
#             center: ['50%', '60%'],
#             data:[
#                 {value:335, name:'直接访问'},
#                 {value:310, name:'邮件营销'},
#                 {value:234, name:'联盟广告'},
#                 {value:135, name:'视频广告'},
#                 {value:1548, name:'搜索引擎'}
#             ]
#         }
#     ]
# };
                    

    # options = _.extend {
    #   plotOptions :
    #     pie : 
    #       allowPointSelect : true
    #       cursor : 'pointer'
    #       dataLabels :
    #         enabled : false
    #       showInLegend : true
    # }, options
    # console.dir data
    # options.series = [
    #   {
    #     type : 'pie'
    #     data : data
    #   }
    # ]
    # obj.highcharts options
  return