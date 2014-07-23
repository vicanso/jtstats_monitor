define 'widget', ['jquery', 'underscore', 'Backbone'], (require, exports, module) ->
  _ = require 'underscore'
  $ = require 'jquery'
  Backbone = require 'Backbone'


  exports.Selector = Backbone.View.extend {
    template : _.template '<div class="content">' +
      '<span class="glyphicon glyphicon-plus"></span>' +
      '<a class="edit" href="javascript:;"><span class="glyphicon glyphicon-edit"></span></a>' +
      '<span class="placeholder"><%= placeholder %></span>' +
      '<span class="items"></span>' +
    '</div>' +
    '<ul class="selectList">' +
      '<div class="arrowTop1"></div>' +
      '<div class="arrowTop2"></div>' +
      '<%= html %>' +
    '</ul>'
    colors : ['#0c92c9', '#0cc99a', '#ffd200', '#ff7f02', '#ff0202', '#ff02af', '#c20cff', '#4c16ff', '#1f63ff', '#28fff7']
    events :
      'click .selectList li' : 'toggle'
    initialize : (options) ->
      @options = options
      @render options.items
    toggle : (e) ->
      obj = $ e.target
      obj.toggleClass 'selected'
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

    render : (items) ->
      $el = @$el
      liTemplate = _.template '<li><span class="unchecked"></span><span class="dot" style="background-color:<%= color %>;"></span><%= name %></li>'
      arr = _.map items, (item, i) =>
        color = @colors[i % @colors.length]
        liTemplate {name : item, color : color}
      html = arr.join ''
      placeholder = @options.placeholder || ''
      $el.addClass('uiSelector').html @template {html : html, placeholder : placeholder}


  }

  return