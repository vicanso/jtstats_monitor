(function() {
  seajs.use(['jquery', 'underscore', 'Backbone', 'stats', 'chart'], function($, _, Backbone, stats, chart) {
    var MainView, StatsListView, mainView, pvStats, reqTotalStats, resTimeStatusStats, statsListView;
    MainView = Backbone.View.extend({
      showError: function(msg) {
        var obj;
        obj = $('<div class="alert alert-danger">' + msg + '</div>');
        obj.appendTo(this.$el);
        return _.delay(function() {
          return obj.remove();
        }, 5000);
      },
      showChartView: function(options) {
        var obj;
        if (this.chartView) {
          this.chartView.remove();
        }
        obj = $('<div class="chartView" />');
        obj.appendTo(this.$el);
        return seajs.use('ChartView', (function(_this) {
          return function(ChartView) {
            var chartView;
            chartView = new ChartView({
              el: obj
            });
            chartView.setOptions(options);
            chartView.show();
            _this.chartView = chartView;
          };
        })(this));
      },
      showStatsAddView: function() {
        var obj;
        if (this.chartView) {
          this.chartView.remove();
        }
        if (this.statsAddView) {
          this.statsAddView.remove();
        }
        obj = $('<div class="addViewContainer" />');
        obj.appendTo(this.$el);
        return seajs.use('StatsAddView', (function(_this) {
          return function(StatsAddView) {
            var statsView;
            statsView = new StatsAddView({
              el: obj
            });
            statsView.on('preview', function(data) {
              return _this.showChartView(data);
            });
            statsView.on('error', function(msg) {
              return _this.showError(msg);
            });
            _this.statsAddView = statsView;
          };
        })(this));
      }
    });
    mainView = new MainView({
      el: $('#homeContainer .mainContainer')
    });
    StatsListView = Backbone.View.extend({
      initialize: function() {},
      events: function() {
        return {
          'click .add': 'add'
        };
      },
      add: function() {
        return mainView.showStatsAddView();
      }
    });
    statsListView = new StatsListView({
      el: $('#homeContainer .statsList')
    });
    statsListView.add();
    pvStats = function() {
      var interval, options;
      interval = 600;
      options = {
        category: 'haproxy',
        date: {
          start: '2014-06-28'
        },
        key: [
          {
            value: 'pv'
          }, {
            value: 'pv.category'
          }
        ],
        point: {
          interval: interval
        }
      };
      return stats.getChartData(options, function(err, data) {
        if (err) {
          return console.error(err);
        } else {
          return chart.line($('.pvContainer'), data, {
            interval: interval,
            title: {
              text: 'PV统计'
            }
          });
        }
      });
    };
    resTimeStatusStats = function() {
      var options;
      options = {
        category: 'haproxy',
        key: {
          value: 'resTime.',
          type: 'reg'
        },
        date: {
          start: '2014-06-28'
        },
        point: {
          interval: 300
        }
      };
      return stats.getChartData(options, function(err, data) {
        if (err) {
          return console.error(err);
        } else {
          return chart.pie($('.resTimeStatusContainer'), data, {
            title: {
              text: 'http响应时间'
            }
          });
        }
      });
    };
    reqTotalStats = function() {
      var options;
      options = {
        category: 'haproxy',
        key: {
          value: 'reqTotal'
        },
        date: {
          start: '2014-06-28'
        }
      };
      return stats.getChartData(options, function(err, data) {
        if (err) {
          return console.error(err);
        } else {
          return chart.column($('.reqTotalContainer'), data, {
            title: {
              text: 'http请求总数'
            }
          });
        }
      });
    };
    if (CONFIG.env === 'development') {
      return seajs.emit('loadComplete');
    }
  });

}).call(this);
