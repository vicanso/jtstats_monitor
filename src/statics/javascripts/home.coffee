seajs.use ['jquery', 'underscore', 'Backbone', 'stats', 'chart'], ($, _, Backbone, stats, chart) ->

  StatsAddView = Backbone.View.extend {
    events : ->
      'click .collections .collection' : 'selectCollection'
    initialize : ->
      @render()
    getCollectionList : ->
      ulHtml = '<ul class="collections dropdown-menu" role="menu">'
      _.each JT_GLOBAL.collections, (collection) ->
        ulHtml += '<li class="collection"><a href="javascript:;">' + collection + '</a></li>'
      ulHtml += '</ul>'
      html = '<div class="input-group collectionSelector">' +
        '<div class="input-group-btn">' +
          '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' + 
            '请选择Collection' +
            '<span class="caret"></span>' +
          '</button>' +
          ulHtml + 
        '</div>' +
        '<input type="text" class="collectionName form-control"></input>' +
      '</div>'
      html

    selectCollection : (e) ->
      collection = $(e.target).text()
      @$el.find('.collectionSelector .collectionName').text collection
    render : ->
      @$el.html '<h1 class="page-header">Add</h1>' + @getCollectionList()

  }

  MainView = Backbone.View.extend {
    showStatsAddView : ->
      @currentView.remove() if @currentView
      obj = $ '<div />'
      obj.appendTo @$el
      @currentView = new StatsAddView {
        el : obj
      }
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