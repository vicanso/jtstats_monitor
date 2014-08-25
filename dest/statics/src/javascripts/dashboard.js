(function() {
  seajs.use(['jquery', 'underscore', 'Backbone', 'widget', 'debug', 'user', 'async'], function($, _, Backbone, widget, debug, user, async) {
    return async.waterfall([
      function(cbf) {
        if (user.isLogedIn()) {
          return cbf(null, user.get('sets'));
        } else {
          return user.on('status', function(status) {
            if (status) {
              return cbf(null, user.get('sets'));
            } else {
              return cbf(new Error('user is not login'));
            }
          });
        }
      }, function(sets, cbf) {
        return $.ajax({
          url: "/set/" + sets[0],
          dataType: 'json'
        }).success(function(res) {
          return cbf(null, res);
        }).error(function(res) {
          return cbf(res);
        });
      }, function(data, cbf) {
        return seajs.use('ChartView', function(ChartView) {
          var charListContainer;
          charListContainer = $('.charListContainer');
          return _.each(data.configs, function(config) {
            var chartView, obj;
            obj = $('<div />');
            obj.addClass("chartView col-xs-" + config.width);
            obj.appendTo(charListContainer);
            chartView = new ChartView({
              el: obj
            });
            chartView.setOptions(config);
            return chartView.show();
          });
        });
      }
    ]);
  });

}).call(this);
