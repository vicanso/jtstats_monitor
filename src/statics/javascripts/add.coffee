seajs.use ['jquery', 'underscore', 'Backbone', 'widget'], ($, _, Backbone, widget) ->
  AddView = Backbone.View.extend {
    events :
      'click .statsType .uiBtn' : 'selectType'
      'change .statsCategory select' : 'selectCategory'
      'click .functions .preview' : 'preview'
      'change .timeSelector .timing input' : 'changeTimeType'

    initialize : ->
      @categorySelector = new widget.Selector {
        el : @$el.find '.statsCategory .selector'
        selectTips : '请选择统计类别'
        items : JT_GLOBAL.collections
      }
      @keySelector = new widget.Selector {
        el : @$el.find '.categorySelector .selector'
        selectTips : '请选择分类'
        placeholder : '请输入分类'
        multi : true
      }
      @intervalSelector = new widget.Selector {
        el : @$el.find '.intervalSelector .selector'
        selectTips : '请选择时间间隔'
        placeholder : '请输入时间间隔(秒)'
        items : ['1分钟', '10分钟', '30分钟', '1小时', '2小时', '6小时', '12小时', '1天']
      }
      @listenTo @categorySelector, 'change', @selectCategory
    selectCategory : ->
      category = @categorySelector.val()
      @_xhr.abort() if @_xhr
      @_xhr = $.getJSON "/collection/#{category}/keys", (data) =>
        @_xhr = null
        @keySelector.options data

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
    getConfig : ->
      type = @$el.find('.statsType .uiBtnSuccess').data 'type'
      category = @categorySelector.val()
      if !category
        @error '请先选择统计类别'
        return
      interval = @intervalSelector.val()
      if !interval
        @error '时间间隔不能为空'
        return
      interval = @convertInterval interval

      keys = @keySelector.val()
      if !keys.length
        @error '类别不能为空'
        return
      dateList = @$el.find '.dateSelector input'
      start = dateList.eq(0).val()
      end = dateList.eq(1).val()
      if !start || !end
        @error '开始与结束日期不能为空'
        return

      # {"stats":[{"category":"sys-mac","key":[{"value":"cpu.0"}]}],"point":{"interval":"60"},"type":"line","date":{"start":"currentMonth","end":"0"},"name":"CPU"}
    preview : ->
      @getConfig()

  }

  addView = new AddView {
    el : $ '.pageContainer'
  }

