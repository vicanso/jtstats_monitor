define 'ChartView', ['underscore', 'stats', 'chart'], (require, exports, module) ->
  stats = require 'stats'
  chart = require 'chart'


  ChartView = Backbone.View.extend {
    setOptions : (@_options) ->

    show : ->
      options = @_options
      if !options
        alert 'options can not be null'
        return
      return if @_isLoading
      @_isLoading = true
      query = _.pick options, ['category', 'key', 'date', 'fill', 'point']
      interval = query.point?.interval
      type = options.type || 'line'
      stats.getChartData query, (err, data) =>
        @_isLoading = false
        if err
          alert err
        else
          chart[type] @$el, data, {
            title : 
              text : options.name || '未定义'
            interval : interval
          }

  }


  module.exports = ChartView

  return