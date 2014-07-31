seajs.use ['jquery', 'underscore', 'Backbone', 'widget', 'debug', 'user'], ($, _, Backbone, widget, debug, user) ->
  debug = debug 'view:add'
  debug 'start run addView'
  AddView = Backbone.View.extend {
    events :
      'click .statsType .btn' : 'selectType'
      'change .statsCategory select' : 'selectCategory'
      'click .functions .preview' : 'preview'
      'click .functions .save' : 'save'
      'click .addConfig' : 'addConfig'
      'click .removeConfig' : 'removeConfig'
      'change .timeSelector .timing input' : 'changeTimeType'

    initialize : ->
      debug 'initialize'
      $el = @$el
      @intervalSelector = new widget.Selector {
        el : $el.find '.intervalSelector .selector'
        selectTips : '请选择时间间隔'
        placeholder : '请输入时间间隔(秒)'
        items : ['1分钟', '10分钟', '30分钟', '1小时', '2小时', '6小时', '12小时', '1天']
      }
      @intervalSelector.on 'change', ->
        @$el.removeClass 'notFilled'
      
      @commonDateSelector = new widget.Selector {
        el : $el.find '.commonDateSelector'
        selectTips : '常用日期间隔'
        items : ['当天', '7天', '15天', '30天', '当月']
      }
      @commonDateSelector.on 'change', =>
        dataInfos =
          '当天' : [0, 0]
          '7天' : [-6, 0]
          '15天' : [-14, 0]
          '30天' : [-29, 0]
          '当月' : ['currentMonth', 0]
        dates = dataInfos[@commonDateSelector.val()]
        return if !dates
        dateObjs = $el.find '.datePickerContainer .date input'
        _.each dates, (date, i) ->
          dateObjs.eq(i).val date

      @statsConfigs = []
      @createStatsConfig $el.find '.statsConfig'
      $el.find('.datePickerContainer .date').datepicker {
        autoclose : true
        format : 'yyyy-mm-dd'
        todayBtn : 'linked'
      }
      $el.find('input').focus ->
        $(@).removeClass 'notFilled'

    removeConfig : (e) ->
      statsConfig = $(e.currentTarget).siblings '.statsConfig'
      statsConfigList = @$el.find '.statsConfig'
      index = statsConfigList.index statsConfig
      removeObj = @statsConfigs.splice(index, 1)[0]
      _.each removeObj, (model) ->
        model.remove()
      statsConfig.closest('.row').remove()

    addConfig : ->
      html = '<div class="row" style="padding:0 15px">' +
        '<span style="float:left">统计参数：</span>' +
        '<a class="removeConfig" href="javascript:;">' +
          '<span class="glyphicon glyphicon-minus"></span>' +
        '</a>' +
        '<div class="statsConfig">' +
          '<div class="statsCategory statsItem col-xs-6">' +
            '<div class="selector"></div>' +
          '</div>' +
          '<div class="categorySelector statsItem col-xs-6">' +
            '<div class="selector"></div>' +
          '</div>' +
        '</div>' +
      '</div>'

      obj = $ html 
      @createStatsConfig obj
      obj.insertBefore @$el.children '.functions'


    createStatsConfig : (obj) ->
      debug 'createStatsConfig'
      categorySelector = new widget.Selector {
        el : obj.find '.statsCategory .selector'
        selectTips : '请选择统计类别'
        items : JT_GLOBAL.collections
      }
      categorySelector.on 'change', ->
        @$el.removeClass 'notFilled'
      # @categorySelectorList = [categorySelector]
      keySelector = new widget.Selector {
        el : obj.find '.categorySelector .selector'
        selectTips : '请选择分类'
        placeholder : '请输入分类'
        multi : true
      }
      keySelector.on 'change', ->
        @$el.removeClass 'notFilled'
      categorySelector.on 'change', =>
        @selectCategory categorySelector, keySelector
      @statsConfigs.push {
        category : categorySelector
        key : keySelector
      }
      # @keySelectorList = [keySelector]

    selectCategory : (categorySelector, keySelector) ->
      debug 'selectCategory'
      category = categorySelector.val()
      @_xhr.abort() if @_xhr
      @_xhr = $.getJSON "/collection/#{category}/keys", (data) =>
        @_xhr = null
        keySelector.options data

    selectType : (e) ->
      obj = $ e.currentTarget
      return if obj.hasClass 'btn-success'
      obj.siblings('.btn-success').addBack().toggleClass 'btn-success'
    changeTimeType : (e) ->
      obj = $ e.currentTarget
      disabled = false
      if obj.val() == 'realTime'
        disabled = true
      @$el.find('.dateSelector input').prop 'disabled', disabled
    convertInterval : (interval) ->
      convertInfos =
        '1分钟' : 60
        '10分钟' : 600
        '30分钟' : 1800
        '1小时' : 3600
        '2小时' : 7200
        '6小时' : 21600
        '12小时' : 43200
        '1天' : 86400
      window.parseInt (convertInfos[interval] || interval)
    getOptions : ->
      $el = @$el
      type = $el.find('.statsType .btn-success').data 'type'
      interval = @intervalSelector.val()
      if !interval
        $el.find('.intervalSelector .selector').addClass 'notFilled'
        return
      interval = @convertInterval interval

      dateList = $el.find '.dateSelector input'
      start = dateList.eq(0).val()
      if !start
        dateList.eq(0).addClass 'notFilled'
        return
      end = dateList.eq(1).val()
      if !end
        dateList.eq(1).addClass 'notFilled'
        return

      convertKeys = (keys) ->
        _.map keys, (key) ->
          if key.charAt(0) == '/'
            if key.charAt(key.length - 1) == '/'
              key = key.substring 1, key.length - 1
            else
              key = key.substring 1
            {
              value : key
              type : 'reg'
            }
          else
            {
              value : key
            }
      stats = []
      _.each @statsConfigs, (statsConfig) ->
        categorySelector = statsConfig.category
        category = categorySelector.val()
        if !category
          categorySelector.$el.addClass 'notFilled'
          return
        keySelector = statsConfig.key
        keys = keySelector.val()
        if !keys.length
          keySelector.$el.addClass 'notFilled'
          return
        stats.push {
          category : category
          keys : convertKeys keys
        }
      return if stats.length != @statsConfigs.length

      config =
        stats : stats
        point : 
          interval : interval
        type : type
        date : 
          start : start
          end : end
      debug 'config %j', config
      config

    preview : ->
      options = @getOptions()
      return if !options
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
    save : ->
      options = @getOptions()
      return if !options
      $el = @$el
      statsNameInput = $el.find '.statsName input'
      name = statsNameInput.val().trim()
      if !name
        statsNameInput.addClass 'notFilled'
        return
      options.name = name
      desc = $el.find('.desc input').val().trim()
      options.desc = desc
      result = $el.find '.result'
      $.ajax({
        url : '/config'
        type : 'post'
        dataType : 'json'
        contentType : 'application/json'
        data : JSON.stringify options
      }).success((res)->
        result.removeClass('hidden alert-danger').addClass('alert-success').html '已成功保证该统计配置！'
      ).error (res) ->
        result.removeClass('hidden alert-success').addClass('alert-danger').html '保存统计配置失败！'

  }

  addView = new AddView {
    el : $ '.statsConfigs'
  }

  seajs.emit 'loadComplete' if CONFIG.env == 'development'

  # $.ajax({
  #   url : '/config'
  #   type : 'post'
  #   dataType : 'json'
  #   contentType : 'application/json'
  #   data : JSON.stringify {
  #     name : 'CPU监控'
  #     desc : 'CPU的监控数据（时间间隔为1分钟）'
  #     stats : [
  #       {
  #         category : 'haproxy'
  #         keys : [
  #           {
  #             value : 'reqTotal'
  #           }
  #         ]
  #       }
  #     ]
  #     point :
  #       interval : 60
  #     type : 'line'
  #     date :
  #       start : '2014-07-16'
  #       end : '2014-07-18'
  #   }
  # }).success((res)->
  # ).error (res) ->


