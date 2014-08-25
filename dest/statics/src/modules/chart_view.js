(function() {
  define('ChartView', ['underscore', 'stats', 'chart', 'async'], function(require, exports, module) {
    var ChartView, async, chart, stats, _;
    stats = require('stats');
    chart = require('chart');
    async = require('async');
    _ = require('underscore');
    ChartView = Backbone.View.extend({
      setOptions: function(_options) {
        this._options = _options;
      },
      show: function() {
        var baseQuery, funcs, getData, interval, name, options, type, _ref;
        options = this._options;
        if (!options) {
          alert('options can not be null');
          return;
        }
        if (this._isLoading) {
          return;
        }
        this._isLoading = true;
        baseQuery = _.pick(options, ['date', 'fill', 'point']);
        interval = (_ref = baseQuery.point) != null ? _ref.interval : void 0;
        type = options.type || 'line';
        name = options.name;
        funcs = _.map(options.stats, function(statsOptions) {
          return function(cbf) {
            statsOptions = _.extend({}, baseQuery, statsOptions);
            return stats.getChartData(statsOptions, cbf);
          };
        });
        getData = (function(_this) {
          return function(cbf) {
            return async.parallel(funcs, function(err, data) {
              _this._isLoading = false;
              if (err) {
                return cbf(err);
              } else {
                data = _.flatten(data, true);
                return cbf(null, data);
              }
            });
          };
        })(this);
        return getData((function(_this) {
          return function(err, data) {
            var func;
            if (err) {
              return alert(err);
            }
            options = {
              title: {
                text: name || '未定义'
              },
              interval: interval
            };
            if (window.parseInt(interval) === -1) {
              func = getData;
            }
            return chart[type](_this.$el.get(0), data, options, func);
          };
        })(this));
      }
    });
    module.exports = ChartView;
  });

}).call(this);
