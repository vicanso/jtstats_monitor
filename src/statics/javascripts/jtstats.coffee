seajs.use ['jquery', 'underscore', 'widget'], ($, _, widget) ->

  new widget.Selector {
    el : $('.selector')
    items : JT_GLOBAL.collections
  }