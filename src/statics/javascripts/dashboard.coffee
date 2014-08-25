seajs.use ['jquery', 'underscore', 'Backbone', 'widget', 'debug', 'user', 'async'], ($, _, Backbone, widget, debug, user, async) ->

  async.waterfall [
    (cbf) ->
      if user.isLogedIn()
        cbf null, user.get 'sets'
      else
        user.on 'status', (status) ->
          if status
            cbf null, user.get 'sets'
          else
            cbf new Error 'user is not login'
    (sets, cbf) ->
      $.ajax({
        url : "/set/#{sets[0]}"
        dataType : 'json'
      }).success((res)->
        cbf null, res
      ).error (res)->
        cbf res
    (data, cbf) ->
      seajs.use 'ChartView', (ChartView) ->
        charListContainer = $ '.charListContainer'
        _.each data.configs, (config) ->
          obj = $ '<div />'
          obj.addClass "chartView col-xs-#{config.width}"
          obj.appendTo charListContainer
          chartView = new ChartView {
            el : obj
          }
          chartView.setOptions config
          chartView.show()

  ]
  