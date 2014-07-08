seajs.use ['jquery', 'underscore', 'Backbone', 'stats', 'chart'], ($, _, Backbone, stats, chart) ->


  MainView = Backbone.View.extend {
    showChartView : (data) ->
      query = _.pick data, ['category', 'key', 'date', 'fill', 'point']
      stats.getChartData query, (err, data) ->
        console.dir data
    showStatsAddView : ->
      @currentView.remove() if @currentView
      obj = $ '<div class="addViewContainer" />'
      obj.appendTo @$el
      seajs.use 'StatsAddView', (StatsAddView) =>
        statsView = new StatsAddView {
          el : obj
        }
        statsView.on 'preview', (data) =>
          @showChartView data
        @currentView = statsView
  }

  mainView = new MainView {
    el : $ '#homeContainer .mainContainer'
  }

  StatsListView = Backbone.View.extend {
    initialize : ->

    events : ->
      'click .add' : 'add'

    add : ->
      mainView.showStatsAddView()
  }



  new StatsListView {
    el : $ '#homeContainer .statsList'
  }



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

  # pvStats()
  # resTimeStatusStats()
  # reqTotalStats()
  if CONFIG.env == 'development'
    seajs.emit 'loadComplete'