define 'widget', ['jquery', 'underscore', 'Backbone', 'debug'], (require, exports, module) ->
  _ = require 'underscore'
  $ = require 'jquery'
  Backbone = require 'Backbone'
  debug = require('debug') 'module:widget'


  SelectorModel = Backbone.Model.extend {
    defaults :
      edit : false
      placeholder : ''
      selectTips : ''
      multi : false

  }

  exports.Selector = Backbone.View.extend {
    template : _.template '<div class="content">' +
      '<span class="glyphicon glyphicon-plus"></span>' +
      '<a class="edit" href="javascript:;"><span class="glyphicon glyphicon-edit"></span></a>' +
      '<div class="userInput hidden"><input type="text" placeholder="<%= placeholder %>" /></div>' +
      '<span class="selectInput">' +
        '<span class="placeholder"><%= selectTips %></span>' +
        '<span class="items"></span>' +
      '</span>' +
    '</div>' +
    '<ul class="selectList">' +
      '<div class="arrowTop1"></div>' +
      '<div class="arrowTop2"></div>' +
      '<%= html %>' +
    '</ul>'
    colors : ['#0c92c9', '#0cc99a', '#ffd200', '#ff7f02', '#ff0202', '#ff02af', '#c20cff', '#4c16ff', '#1f63ff', '#28fff7']
    events :
      'click .selectList li' : 'toggle'
      'click .content .edit' : 'toggleEdit'
    initialize : (options) ->
      options = _.omit options, 'el'
      debug 'initialize selector %j', options
      @model = new SelectorModel options
      @listenTo @model, 'change:edit', @editModeChange
      @listenTo @model, 'change:items', @render
      @render()
      @
    ###*
     * [toggleEdit description]
     * @return {[type]} [description]
    ###
    toggleEdit : ->
      @model.set 'edit', !@model.get 'edit'
    ###*
     * [editModeChange 编辑模式修改]
     * @param  {[type]} model [description]
     * @param  {[type]} edit  [description]
     * @return {[type]}       [description]
    ###
    editModeChange : (model, edit) ->
      $el = @$el
      userInput = $el.find '.content .userInput'
      selectInput = $el.find '.content .selectInput'
      $el.find('.content .userInput, .content .selectInput').toggleClass 'hidden'
      if edit
        $el.addClass 'editMode'
      else
        $el.removeClass 'editMode'
    options : (data) ->
      if data
        @model.set 'items', data
      else
        @model.get 'items'
    getSelectListHtml : ->
      liTemplate = _.template '<li><span class="checkIcon"></span><span class="dot" style="background-color:<%= color %>;"></span><%= name %></li>'
      arr = _.map @model.get('items'), (item, i) =>
        color = @colors[i % @colors.length]
        liTemplate {name : item, color : color}
      arr.join ''

    ###*
     * [toggle selector中的toggle]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
    ###
    toggle : (e) ->
      obj = $ e.currentTarget
      if @model.get 'multi'
        if obj.hasClass 'selected'
          obj.removeClass 'selected'
          obj.find('.checkIcon').removeClass 'glyphicon glyphicon-ok'
        else
          obj.addClass 'selected'
          obj.find('.checkIcon').addClass 'glyphicon glyphicon-ok'
      else if !obj.hasClass 'selected'
        obj.addClass('selected').find('.checkIcon').addClass 'glyphicon glyphicon-ok'
        obj.siblings('.selected').removeClass('selected').find('.checkIcon').removeClass 'glyphicon glyphicon-ok'
      $el = @$el
      selectedItems = @$el.find '.selectList .selected'
      arr = _.map selectedItems, (item) ->
        item = $ item
        '<span class="item">' + item.html() + '</span>'
      placeholderObj = $el.find '.content .placeholder'
      if selectedItems.length
        placeholderObj.addClass 'hidden'
      else
        placeholderObj.removeClass 'hidden'
      $el.find('.content .items').html arr.join ''
      @trigger 'change'
    ###*
     * [render render模板]
     * @return {[type]} [description]
    ###
    render : ->
      $el = @$el
      html = @getSelectListHtml()
      placeholder = @model.get 'placeholder'
      selectTips = @model.get 'selectTips'
      data = @model.toJSON()
      data.html = html
      $el.addClass('uiSelector').html @template data
    ###*
     * [val description]
     * @return {[type]} [description]
    ###
    val : ->
      if @model.get 'edit'
        values = [@$el.find('.content .userInput input').val().trim()]
      else
        values = _.map @$el.find('.content .items .item'), (item) ->
          $(item).text()
      if @model.get 'multi'
        values
      else
        values[0]
    reset : ->
      @render()
  }

  return