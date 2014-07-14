define 'ChartView', ['underscore', 'stats', 'chart', 'async'], (require, exports, module) ->
  stats = require 'stats'
  chart = require 'chart'
  async = require 'async'
  _ = require 'underscore'


  ChartView = Backbone.View.extend {
    setOptions : (@_options) ->

    show : ->
      options = @_options
      if !options
        alert 'options can not be null'
        return
      return if @_isLoading
      @_isLoading = true
      baseQuery = _.pick options, ['date', 'fill', 'point']
      interval = baseQuery.point?.interval
      type = options.type || 'line'
      name = options.name
      funcs = _.map options.stats, (statsOptions) ->
        (cbf) ->
          statsOptions = _.extend {}, baseQuery, statsOptions
          stats.getChartData statsOptions, cbf
      async.parallel funcs, (err, data) =>
        @_isLoading = false
        if err
          alert err
        else
          data = _.flatten data, true
          chart[type] @$el, data, {
            title : 
              text : name || '未定义'
            interval : interval
          }

  }


  module.exports = ChartView

  return