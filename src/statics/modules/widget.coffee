define 'widget', ['jquery', 'underscore', 'Backbone'], (require, exports, module) ->
  _ = require 'underscore'
  $ = require 'jquery'
  Backbone = require 'Backbone'


  exports.Selector = Backbone.Model.extend {
    defaults :
      edit : false
      placeholder : ''
      selectTips : ''

  }

  exports.SelectorView = Backbone.View.extend {
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
      # @model = new SelectorModel _.pick options, ['items', 'placeholder', 'edit', 'selectTips']
      @listenTo @model, 'change:edit', @editModeChange
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
    ###*
     * [toggle selector中的toggle]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
    ###
    toggle : (e) ->
      obj = $ e.target
      if obj.hasClass 'selected'
        obj.removeClass 'selected'
        obj.find('.checkIcon').removeClass 'glyphicon glyphicon-ok'
      else
        obj.addClass 'selected'
        obj.find('.checkIcon').addClass 'glyphicon glyphicon-ok'
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
      @changeValue()
    changeValue : ->
      if @model.get 'edit'
        val = @$el.find('.content .userInput').val().trim()
        @model.set 'values', [val]
      else
        values = _.map @$el.find('.content .selectInput .item'), (item) ->
          $(item).text()
        @model.set 'values', values
    ###*
     * [render render模板]
     * @return {[type]} [description]
    ###
    render : ->
      $el = @$el
      liTemplate = _.template '<li><span class="checkIcon"></span><span class="dot" style="background-color:<%= color %>;"></span><%= name %></li>'
      arr = _.map @model.get('items'), (item, i) =>
        color = @colors[i % @colors.length]
        liTemplate {name : item, color : color}
      html = arr.join ''
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
        @$el.find('.content .userInput').val().trim()
      else
        arr = _.map @$el.find('.content .items'), (item) ->
          $(item).text()
        arr.join ','
  }

  return