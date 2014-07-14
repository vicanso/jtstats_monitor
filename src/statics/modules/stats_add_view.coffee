define 'StatsAddView', ['jquery', 'underscore', 'Backbone'], (require, exports, module) ->
  _ = require 'underscore'
  $ = require 'jquery'
  Backbone = require 'Backbone'


  dateRowHtml = do ->
    getDateInputHtml = (tips, placeholder) ->
      '<div class="col-xs-6 col-sm-4">' +
        '<div class="input-group">' + 
          '<span class="input-group-addon">' + tips + '</span>' +
          '<input type="text" class="form-control" placeholder="' + placeholder + '">' +
        '</div>' +
      '</div>'
    getPeriodSelectorHtml = (dateInfos) ->
      periodHtml = '<div class="col-xs-6 col-sm-4"><div class="btn-group dateList">'
      dateTemplate = _.template '<button type="button" class="btn btn-default" data-start="<%= start %>" data-end="<%= end %>"><%= text %></button>'
      _.each dateInfos, (info) ->
        periodHtml += dateTemplate info
      periodHtml += '</div></div>'

    dateInfos = [
      {
        text : '当天'
        start : 0
        end : 0
      }
      {
        text : '7天'
        start : -6
        end : 0
      }
      {
        text : '15天'
        start : -14
        end : 0
      }
      {
        text : '30天'
        start : -29
        end : 0
      }
      {
        text : '当月'
        start : 'currentMonth'
        end : 0
      }
    ]
    '<div class="row dateRow">' +
      getDateInputHtml('开始日期', '请输入开始日期(YYYY-MM-DD)') +
      getDateInputHtml('结束日期', '请输入结束日期(YYYY-MM-DD)') +
      getPeriodSelectorHtml(dateInfos) +
    '</div>'

  functionHtml = do ->
    btnTemplate = _.template '<div class="col-xs-6 col-sm-4">' +
      '<button class="btn <%= itemClass %>"><%= name %></button>' +
    '</div>'
    getBtn = (item) ->
      btnTemplate item
    html = '<div class="row function">' +
      '<div class="col-xs-6 col-sm-4"><div class="input-group">' + 
        '<span class="input-group-addon">名称</span>' +
        '<input type="text" class="form-control" placeholder="请输入该统计的名称">' +
      '</div></div>'
    btns = [
      {
        name : '预览'
        itemClass : 'preview btn-danger'
      }
      {
        name : '保存'
        itemClass : 'save btn-success'
      }
    ]
    _.each btns, (btn) ->
      html += getBtn btn
    html += '</div>'

   # '<div class="row function">' +
    # '<div class="col-xs-6 col-sm-4">' 


  StatsAddView = Backbone.View.extend {
    events : ->
      'click .categorySelector .dropdown-menu li' : 'selectCategory'
      'click .keySelector .dropdown-menu li' : 'selectKey'
      'click .typeSelector .dropdown-menu li' : 'selectType'
      'click .intervalSelector .dropdown-menu li' : 'selectInterval'
      'click .dateList .btn' : 'selectDate'
      'click .function .preview' : 'preview'
      'click .addCategory' : 'addCategory'
      'click .deleteCategory' : 'deleteCategory'
    initialize : ->
      @render()
    getSelector : (items, itemClass, tips, defaultValue = '') ->
      ulHtml = '<ul class="dropdown-menu" role="menu">'
      _.each items, (item) ->
        ulHtml += '<li><a href="javascript:;"><span class="glyphicon"></span>' + item + '</a></li>'
      ulHtml += '</ul>'
      html = '<div class="col-xs-6 col-sm-4 ' + itemClass + ' selector"><div class="input-group">' +
        '<div class="input-group-btn">' +
          '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' + 
            tips +
            '<span class="caret"></span>' +
          '</button>' +
          ulHtml + 
        '</div>' +
        '<input type="text" class="form-control" value="' + defaultValue + '"></input>' +
      '</div></div>'
      html
    getCategoryList : ->
      @getSelector JT_GLOBAL.collections, 'categorySelector', '请选择分类'
    getTypeList : ->
      @getSelector ['line', 'column', 'pie'], 'typeSelector', '请选择类型'
    getIntervalList : ->
      @getSelector ['1m', '10m', '30m', '1h', '2h', '6h', '12h', '1d'], 'intervalSelector', '请选择时间间隔(秒)', 60
    getKeyList : (keys) ->
      @getSelector keys, 'keySelector', '请选择key'

    addCategory : ->
      html = '<div class="row selectorList stats">' +
        @getCategoryList() +
        @getKeyList() +
        '<div class="col-xs-6 col-sm-4"><button class="deleteCategory btn btn-warning">删除</button></div>' +
      '</div>'

      @$el.find('.selectorList:last').before html
      @
    deleteCategory : (e) ->
      $(e.target).closest('.selectorList').remove()
      @

    showKeySelector : (collection, index) ->
      $.ajax({
        url : "/collection/#{collection}/keys"
        dataType : 'json'
      }).success((res)=>
        obj = $ @getKeyList res
        selector = @$el.find('.selectorList').find('.keySelector').eq index
        isClickDropdownMenu = false
        obj.find('.dropdown-menu').on 'click', ->
          isClickDropdownMenu = true
        obj.find('.input-group-btn').on 'hide.bs.dropdown', (e) ->
          if isClickDropdownMenu
            e.preventDefault()
          isClickDropdownMenu = false
          return
        selector.after obj
        selector.remove()
      ).error (res) ->
      @
    selectKey : (e) ->
      obj = $ e.target
      obj.toggleClass 'selected'
      obj.find('.glyphicon').toggleClass 'glyphicon-ok'
      selectedItems = obj.closest('.dropdown-menu').find '.selected'
      arr = _.map selectedItems, (item) ->
        $(item).text()
      obj.closest('.keySelector').find('input').val arr.join ','
      e.preventDefault()

    selectType : (e) ->
      obj = $ e.target
      type = obj.text()
      @$el.find('.typeSelector input').val type
    selectCategory : (e) ->
      obj = $ e.target
      category = obj.text()
      categorySelector = obj.closest '.categorySelector'
      categorySelector.find('input').val category
      index = @$el.find('.categorySelector').index categorySelector
      @showKeySelector category, index
    selectDate : (e) ->
      obj = $ e.target
      start = obj.data 'start'
      end = obj.data 'end'
      inputs = @$el.find '.dateRow .form-control'
      inputs.eq(0).val start
      inputs.eq(1).val end
    selectInterval : (e) ->
      interval = $(e.target).text()
      unitValues = 
        'm' : 60
        'h' : 3600
        'd' : 24 * 3600
      unit = unitValues[interval.charAt(interval.length - 1).toLowerCase()]

      @$el.find('.intervalSelector input').val window.parseInt(interval) * unit
      
    preview : ->
      inputs = @$el.find 'input'
      notFillItemIndex = -1
      arr = _.map inputs, (input, i) ->
        input = $ input
        val = input.val().trim()
        notFillItemIndex = i if !val && !~notFillItemIndex
        val
      if ~notFillItemIndex
        inputs.eq(notFillItemIndex).focus()
        @trigger 'error', '请填写统计配置参数，不能为空！'
        return
      getKey = (key) ->
        _.map key.split(','), (key) ->
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
      setting = @$el.find '.selectorList.setting'
      dateList = @$el.find '.dateRow input'
      stats = _.map @$el.find('.selectorList.stats'), (item) ->
        obj = $ item
        inputs = obj.find 'input'
        {
          category : inputs.eq(0).val().trim()
          key : getKey inputs.eq(1).val().trim()
        }

      data =
        stats : stats
        point :
          interval : setting.find('.intervalSelector input').val().trim()
        type : setting.find('.typeSelector input').val().trim()
        date :
          start : dateList.eq(0).val().trim()
          end : dateList.eq(1).val().trim()
        name : @$el.find('.function input').val().trim()


      @trigger 'preview', data
    render : ->
      html = '<h1 class="page-header">Add</h1>' +
        '<div class="row selectorList stats">' +
          @getCategoryList() +
          @getKeyList() +
          '<div class="col-xs-6 col-sm-4"><button class="addCategory btn btn-primary">增加</button></div>' +
        '</div>' +
        '<div class="row selectorList setting">' +
          @getIntervalList() +
          @getTypeList() +
        '</div>' +
        dateRowHtml +
        functionHtml
      @$el.html html


  }

  module.exports = StatsAddView

  return