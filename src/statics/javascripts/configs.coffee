seajs.use ['jquery', 'underscore', 'Backbone', 'user', 'debug'], ($, _, Backbone, user, debug) ->
  debug = debug 'view:configs'
  debug 'start run configsView'
  ConfigsView = Backbone.View.extend {
    events :
      'click .preview' : 'preview'
      'click .chartViewContainer .close' : 'closePreview'
    initialize : ->
      debug 'initialize'
      $el = @$el

    closePreview : ->
      @chartView.remove() if @chartView
      @$el.find('.chartViewContainer').addClass 'hidden'
    preview : (e) ->
      @chartView.remove() if @chartView
      $el = @$el
      tr = $(e.currentTarget).closest 'tr'
      index = tr.index()
      chartViewContainer = $el.find '.chartViewContainer'
      panel = chartViewContainer.removeClass('hidden').find('.panel-body').html 'loading...'
      seajs.use 'ChartView', (ChartView) =>
        obj = $ '<div class="chartView" />'
        panel.empty().append obj
        chartView = new ChartView {
          el : obj
        }
        chartView.setOptions JT_GLOBAL.configs[index]
        chartView.show()
        @chartView = chartView

  }


  new ConfigsView {
    el : $ '.statsConfigs'
  }
  # user.create {
  #   name : 'vicanso'
  #   pwd : 'oajfoeajfeo'
  # }, (err, res) ->
  #   console.dir err
  #   console.dir res