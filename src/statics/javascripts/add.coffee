seajs.use ['jquery', 'underscore', 'Backbone', 'widget'], ($, _, Backbone, widget) ->
  AddView = Backbone.View.extend {
    events :
      'click .statsType .btn' : 'selectType'

    initialize : ->
      selector = new widget.Selector {
        selectTips : '请选择分类'
        placeholder : '请输入分类'
        items : JT_GLOBAL.collections
      }
      new widget.SelectorView {
        el : @$el.find '.categorySelector'
        model : selector
      }
      _.delay ->
        console.dir selector.get 'values'
      , 20 * 1000
    selectType : (e) ->
      obj = $ e.target
      return if obj.hasClass 'selected'
      obj.siblings('.selected').addBack().toggleClass 'selected'
  }

  addView = new AddView {
    el : $ '.pageContainer'
  }

  # _.delay ->
  #   console.dir addView.val()
  # , 10 * 1000