seajs.use ['jquery', 'underscore', 'Backbone', 'stats', 'chart'], ($, _, Backbone, stats, chart) ->


  pvStats = ->
    options =
      category : 'haproxy'
      date : 
        start : -1
      key : [
        {
          value : 'pv'
        }
        {
          value : 'pv.category'
        }
      ]
    stats.getChartData options, (err, data) ->
      if err
        console.error err
      else
        chart.line $('.pvContainer'), data

  resTimeStatusStats = ->
    options =
      category : 'haproxy'
      key : 
        value : 'resTime.'
        type : 'reg'
      date :
        start : -1
      point : 
        interval : 300
    stats.getChartData options, (err, data) ->
      if err
        console.error err
      else
        chart.pie $('.resTimeStatusContainer'), data, {
          plotOptions :
            enabled : false
        }

  reqTotalStats = ->
    options =
      category : 'haproxy'
      key : 
        value : 'reqTotal'
    stats.getChartData options, (err, data) ->
      console.dir data
      if err
        console.error err
      else
        chart.line $('.reqTotalContainer'), data

  # pvStats()
  resTimeStatusStats()
  # reqTotalStats()
  if CONFIG.env == 'development'
    seajs.emit 'loadComplete'