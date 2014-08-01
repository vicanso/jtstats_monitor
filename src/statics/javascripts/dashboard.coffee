seajs.use ['jquery', 'underscore', 'Backbone', 'widget', 'debug', 'user'], ($, _, Backbone, widget, debug, user) ->

  charListContainer = $ '#contentContainer .charListContainer'
  seajs.use 'ChartView', (ChartView) =>
    _.each JT_GLOBAL.userConfigs, (statsConfig) ->
      obj = $ '<div class="chartView" />'
      obj.attr 'title', statsConfig.desc
      obj.appendTo charListContainer
      chartView = new ChartView {
        el : obj
      }
      chartView.setOptions statsConfig
      chartView.show()