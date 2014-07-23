seajs.use ['jquery', 'underscore', 'Backbone', 'widget'], ($, _, Backbone, widget) ->
  AddView = Backbone.View.extend {
    events :
      'click .statsType .btn' : 'selectType'

    initialize : ->
      new widget.Selector {
        el : @$el.find '.categorySelector'
        placeholder : '请选择分类'
        items : JT_GLOBAL.collections
      }
    selectType : (e) ->
      obj = $ e.target
      return if obj.hasClass 'selected'
      obj.siblings('.selected').addBack().toggleClass 'selected'
  }

  new AddView {
    el : $ '.pageContainer'
  }