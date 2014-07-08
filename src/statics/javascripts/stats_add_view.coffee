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
      'click .collectionSelector .dropdown-menu li' : 'selectCollection'
      'click .keySelector .dropdown-menu li' : 'selectKey'
      'click .typeSelector .dropdown-menu li' : 'selectType'
      'click .dateList .btn' : 'selectDate'
    initialize : ->
      @render()
    getSelector : (items, itemClass, tips) ->
      ulHtml = '<ul class="dropdown-menu" role="menu">'
      _.each items, (item) ->
        ulHtml += '<li><a href="javascript:;">' + item + '</a></li>'
      ulHtml += '</ul>'
      html = '<div class="col-xs-6 col-sm-4 ' + itemClass + '"><div class="input-group">' +
        '<div class="input-group-btn">' +
          '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' + 
            tips +
            '<span class="caret"></span>' +
          '</button>' +
          ulHtml + 
        '</div>' +
        '<input type="text" class="form-control"></input>' +
      '</div></div>'
      html
    getCollectionList : ->
      @getSelector JT_GLOBAL.collections, 'collectionSelector', '请选择Collection'
    getTypeList : ->
      @getSelector ['line', 'column', 'pie'], 'typeSelector', '请选择类型'
    getKeyList : (keys) ->
      @getSelector keys, 'keySelector', '请选择key'
    showKeySelector : (collection) ->
      $.ajax({
        url : "/collection/#{collection}/keys"
        dataType : 'json'
      }).success((res)=>
        html = @getKeyList res
        selector = @$el.find('.selectorList').find('.keySelector')
        selector.after html
        selector.remove()
      ).error (res) ->
    selectKey : (e) ->
      key = $(e.target).text()
      @$el.find('.keySelector input').val key
    selectType : (e) ->
      type = $(e.target).text()
      @$el.find('.typeSelector input').val type
    selectCollection : (e) ->
      collection = $(e.target).text()
      @$el.find('.collectionSelector input').val collection
      @showKeySelector collection
    selectDate : (e) ->
      obj = $ e.target
      start = obj.data 'start'
      end = obj.data 'end'
      inputs = @$el.find '.dateRow .form-control'
      inputs.eq(0).val start
      inputs.eq(1).val end

    render : ->
      html = '<h1 class="page-header">Add</h1>' +
        '<div class="row selectorList">' +
          @getCollectionList() +
          @getKeyList() +
          @getTypeList() +
        '</div>' +
        dateRowHtml +
        functionHtml 
      @$el.html html

  }

  module.exports = StatsAddView

  return