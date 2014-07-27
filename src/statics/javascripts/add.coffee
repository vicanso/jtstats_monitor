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
        items : ['1M', '10M', '30M', '1H', '2H', '6H', '12H', '1D']
      }
      @listenTo @categorySelector, 'change', @selectCategory
    selectCategory : ->
      category = @categorySelector.val()[0]
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
    getConfig : ->
      type = @$el.find('.statsType .uiBtnSuccess').data 'type'
      categoryList = @categorySelector.val()
      console.dir categoryList

      # {"stats":[{"category":"sys-mac","key":[{"value":"cpu.0"}]}],"point":{"interval":"60"},"type":"line","date":{"start":"currentMonth","end":"0"},"name":"CPU"}
    preview : ->
      @getConfig()

  }

  addView = new AddView {
    el : $ '.pageContainer'
  }

