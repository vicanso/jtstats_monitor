seajs.use ['jquery', 'underscore', 'Backbone', 'stats', 'chart'], ($, _, Backbone, stats, chart) ->


  MainView = Backbone.View.extend {
    showError : (msg) ->
      obj = $ '<div class="alert alert-danger">' + msg + '</div>'
      obj.appendTo @$el
      _.delay ->
        obj.remove()
      , 5000
    showChartView : (options) ->
      @chartView.remove() if @chartView
      obj = $ '<div class="chartView" />'
      obj.appendTo @$el
      seajs.use 'ChartView', (ChartView) =>
        chartView = new ChartView {
          el : obj
        }
        chartView.setOptions options
        chartView.show()
        @chartView = chartView
        return
    showStatsAddView : ->
      @chartView.remove() if @chartView
      @statsAddView.remove() if @statsAddView
      obj = $ '<div class="addViewContainer" />'
      obj.appendTo @$el

      seajs.use 'StatsAddView', (StatsAddView) =>
        statsView = new StatsAddView {
          el : obj
        }
        statsView.on 'preview', (data) =>
          @showChartView data
        statsView.on 'error', (msg) =>
          @showError msg
        @statsAddView = statsView
        return
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



  statsListView = new StatsListView {
    el : $ '#homeContainer .statsList'
  }
  statsListView.add()


  # seajs.use 'ChartView', (ChartView) ->
  #   interval = 600
  #   options =
  #     category : 'haproxy'
  #     date : 
  #       start : '2014-06-28'
  #     key : [
  #       {
  #         value : 'pv'
  #       }
  #       {
  #         value : 'pv.category'
  #       }
  #     ]
  #     point :
  #       interval : interval

  #   chartView = new ChartView {
  #     el : $('.pvContainer')
  #   }
  #   chartView.setOptions options
  #   chartView.show()


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