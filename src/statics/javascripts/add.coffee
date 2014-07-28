seajs.use ['jquery', 'underscore', 'Backbone', 'widget', 'debug'], ($, _, Backbone, widget, debug) ->
  debug = debug 'view:add'
  debug 'start run addView'
  AddView = Backbone.View.extend {
    events :
      'click .statsType .uiBtn' : 'selectType'
      'change .statsCategory select' : 'selectCategory'
      'click .functions .preview' : 'preview'
      'change .timeSelector .timing input' : 'changeTimeType'

    initialize : ->
      $el = @$el
      categorySelector = new widget.Selector {
        el : $el.find '.statsCategory .selector'
        selectTips : '请选择统计类别'
        items : JT_GLOBAL.collections
      }
      categorySelector.on 'change', ->
        @$el.removeClass 'notFilled'
      @categorySelectorList = [categorySelector]
      keySelector = new widget.Selector {
        el : $el.find '.categorySelector .selector'
        selectTips : '请选择分类'
        placeholder : '请输入分类'
        multi : true
      }
      keySelector.on 'change', ->
        @$el.removeClass 'notFilled'
      @keySelectorList = [keySelector]
      @intervalSelector = new widget.Selector {
        el : $el.find '.intervalSelector .selector'
        selectTips : '请选择时间间隔'
        placeholder : '请输入时间间隔(秒)'
        items : ['1分钟', '10分钟', '30分钟', '1小时', '2小时', '6小时', '12小时', '1天']
      }
      @intervalSelector.on 'change', ->
        @$el.removeClass 'notFilled'
      categorySelector.on 'change', =>
        @selectCategory categorySelector, keySelector
      # @listenTo categorySelector, 'change', @selectCategory
    selectCategory : (categorySelector, keySelector) ->
      category = categorySelector.val()
      @_xhr.abort() if @_xhr
      @_xhr = $.getJSON "/collection/#{category}/keys", (data) =>
        @_xhr = null
        keySelector.options data

    selectType : (e) ->
      obj = $ e.currentTarget
      return if obj.hasClass 'uiBtnSuccess'
      obj.siblings('.uiBtnSuccess').addBack().toggleClass 'uiBtnSuccess'
    changeTimeType : (e) ->
      obj = $ e.currentTarget
      disabled = false
      if obj.val() == 'realTime'
        disabled = true
      @$el.find('.dateSelector input').prop 'disabled', disabled
    error : (msg) ->
      warning = @$el.find '.header .warning'
      if msg
        warning.removeClass('hidden').text msg
      else
        warning.addClass 'hidden'
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
      convertInfos[interval] || 60
    getOptions : ->
      $el = @$el
      type = $el.find('.statsType .uiBtnSuccess').data 'type'
      interval = @intervalSelector.val()
      if !interval
        $el.find('.intervalSelector .selector').addClass 'notFilled'
        return
      interval = @convertInterval interval


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

      category = @categorySelector.val()
      if !category
        $el.find('.statsCategory .selector').addClass 'notFilled'
        return

      keys = @keySelector.val()
      if !keys.length
        $el.find('.categorySelector .selector').addClass 'notFilled'
        return
      dateList = $el.find '.dateSelector input'
      start = dateList.eq(0).val()
      if !start
        dateList.eq(0).closest('.start').addClass 'notFilled'
        return
      end = dateList.eq(1).val()
      if !end
        dateList.eq(1).closest('.end').addClass 'notFilled'
        return

      config =
        stats : [
          {
            category : category
            keys : convertKeys keys
          }
        ]
        point : 
          interval : interval
        type : type
        date : 
          start : start
          end : end

      # {"stats":[{"category":"sys-mac","key":[{"value":"cpu.0"}]}],"point":{"interval":"60"},"type":"line","date":{"start":"currentMonth","end":"0"},"name":"CPU"}
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

  }

  addView = new AddView {
    el : $ '.statsConfigs'
  }

