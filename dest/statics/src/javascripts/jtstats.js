(function() {
  seajs.use(['jquery', 'underscore', 'widget'], function($, _, widget) {
    return new widget.Selector({
      el: $('.selector'),
      items: JT_GLOBAL.collections
    });
  });

}).call(this);
