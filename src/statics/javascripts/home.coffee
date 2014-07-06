seajs.use ['jquery', 'underscore', 'Backbone', 'stats', 'chart'], ($, _, Backbone, stats, chart) ->


  pvStats = ->
    interval = 600
    options =
      category : 'haproxy'
      date : 
        start : '2014-06-28'
      key : [
        {
          value : 'pv'
        }
        {
          value : 'pv.category'
        }
      ]
      point :
        interval : interval

    stats.getChartData options, (err, data) ->
      if err
        console.error err
      else
        chart.line $('.pvContainer'), data, {
          interval : interval
          title : 
            text : 'PV统计'
        }
        # chart.line $('.pvContainer'), data

  resTimeStatusStats = ->
    options =
      category : 'haproxy'
      key : 
        value : 'resTime.'
        type : 'reg'
      date :
        start : '2014-06-28'
      point : 
        interval : 300
    stats.getChartData options, (err, data) ->
      if err
        console.error err
      else
        chart.pie $('.resTimeStatusContainer'), data, {
          title : 
            text : 'http响应时间'
        }

  reqTotalStats = ->
    options =
      category : 'haproxy'
      key : 
        value : 'reqTotal'
      date :
        start : '2014-06-28'
    stats.getChartData options, (err, data) ->
      if err
        console.error err
      else
        chart.column $('.reqTotalContainer'), data, {
          title : 
            text : 'http请求总数'
        }

  pvStats()
  resTimeStatusStats()
  reqTotalStats()
  if CONFIG.env == 'development'
    seajs.emit 'loadComplete'