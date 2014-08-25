(function() {
  seajs.use(['jquery', 'underscore', 'Backbone', 'widget', 'debug', 'user'], function($, _, Backbone, widget, debug, user) {
    var StatsConfigsView, StatsParamsView, TimeConfigView;
    debug = debug('view:add');
    debug('start run addView');
    TimeConfigView = Backbone.View.extend({
      initialize: function() {
        var $el;
        debug('initialize TimeConfigView');
        $el = this.$el;
        this.intervalSelector = new widget.Selector({
          el: $el.find('.intervalSelector'),
          selectTips: '请选择时间间隔',
          placeholder: '请输入时间间隔(秒)',
          items: ['1分钟', '10分钟', '30分钟', '1小时', '2小时', '6小时', '12小时', '1天']
        });
        this.intervalSelector.on('change', function() {
          return this.$el.removeClass('notFilled');
        });
        this.commonDateSelector = new widget.Selector({
          el: $el.find('.commonDateSelector'),
          selectTips: '常用日期间隔',
          items: ['当天', '7天', '15天', '30天', '当月']
        });
        this.commonDateSelector.on('change', (function(_this) {
          return function() {
            var dataInfos, dateObjs, dates;
            dataInfos = {
              '当天': [0, 0],
              '7天': [-6, 0],
              '15天': [-14, 0],
              '30天': [-29, 0],
              '当月': ['currentMonth', 0]
            };
            dates = dataInfos[_this.commonDateSelector.val()];
            if (!dates) {
              return;
            }
            dateObjs = $el.find('.date input');
            return _.each(dates, function(date, i) {
              return dateObjs.eq(i).val(date);
            });
          };
        })(this));
        $el.find('.date').datepicker({
          autoclose: true,
          format: 'yyyy-mm-dd',
          todayBtn: 'linked'
        });
        return $el.find('.date input').focus(function() {
          return $(this).removeClass('notFilled');
        });
      },
      convertInterval: function(interval) {
        var convertInfos;
        convertInfos = {
          '1分钟': 60,
          '10分钟': 600,
          '30分钟': 1800,
          '1小时': 3600,
          '2小时': 7200,
          '6小时': 21600,
          '12小时': 43200,
          '1天': 86400
        };
        return window.parseInt(convertInfos[interval] || interval);
      },
      getConfig: function() {
        var $el, dateList, end, interval, start;
        $el = this.$el;
        interval = this.intervalSelector.val();
        if (!interval) {
          $el.find('.intervalSelector').addClass('notFilled');
          return;
        }
        interval = this.convertInterval(interval);
        dateList = $el.find('.date input');
        start = dateList.eq(0).val();
        if (!start) {
          dateList.eq(0).addClass('notFilled');
          return;
        }
        end = dateList.eq(1).val();
        if (!end) {
          dateList.eq(1).addClass('notFilled');
          return;
        }
        return {
          interval: interval,
          start: start,
          end: end
        };
      }
    });
    StatsParamsView = Backbone.View.extend({
      initialize: function(options) {
        var $el, categorySelector, keySelector;
        $el = this.$el;
        categorySelector = new widget.Selector({
          el: $el.find('.statsSelector'),
          selectTips: '请选择统计类别',
          items: JT_GLOBAL.collections
        });
        categorySelector.on('change', function() {
          return this.$el.removeClass('notFilled');
        });
        keySelector = new widget.Selector({
          el: $el.find('.categorySelector'),
          selectTips: '请选择分类',
          placeholder: '请输入分类',
          multi: true
        });
        keySelector.on('change', function() {
          return this.$el.removeClass('notFilled');
        });
        categorySelector.on('change', (function(_this) {
          return function() {
            return _this.selectCategory(categorySelector, keySelector);
          };
        })(this));
        $el.find('.types').on('click', '.btn', function() {
          var tmp;
          tmp = $(this);
          if (tmp.hasClass('btn-success')) {
            return;
          }
          return tmp.siblings('.btn-success').addBack().toggleClass('btn-success');
        });
        this.categorySelector = categorySelector;
        this.keySelector = keySelector;
        return this.enableTypeSelect(options.statsType);
      },
      enableTypeSelect: function(type) {
        var btns;
        btns = this.$el.find('.types .btn');
        btns.removeClass('disabled btn-success');
        if (~_.indexOf(['line', 'stack'], type)) {
          btns.filter(':last').addClass('disabled');
          return btns.eq(0).addClass('btn-success');
        } else if (~_.indexOf(['barVertical', 'barHorizontal', 'stackBarVertical', 'stackBarHorizontal'], type)) {
          btns.filter(':last').addClass('disabled');
          return btns.eq(1).addClass('btn-success');
        } else if (~_.indexOf(['pie', 'nestedPie'], type)) {
          btns.filter(':not(:last)').addClass('disabled');
          return btns.eq(2).addClass('btn-success');
        } else {
          return btns.addClass('disabled');
        }
      },
      selectCategory: function(categorySelector, keySelector) {
        var category;
        debug('selectCategory');
        category = categorySelector.val();
        if (this._xhr) {
          this._xhr.abort();
        }
        this._xhr = $.getJSON("/collection/" + category + "/keys", (function(_this) {
          return function(data) {
            _this._xhr = null;
            return keySelector.options(data);
          };
        })(this));
        return this;
      },
      getParams: function() {
        var $el, category, categorySelector, convertKeys, index, keySelector, keys, typeList;
        $el = this.$el;
        categorySelector = this.categorySelector;
        category = categorySelector.val();
        if (!category) {
          categorySelector.$el.addClass('notFilled');
          return;
        }
        keySelector = this.keySelector;
        keys = keySelector.val();
        if (!keys.length) {
          keySelector.$el.addClass('notFilled');
          return;
        }
        convertKeys = function(keys) {
          return _.map(keys, function(key) {
            if (key.charAt(0) === '/') {
              if (key.charAt(key.length - 1) === '/') {
                key = key.substring(1, key.length - 1);
              } else {
                key = key.substring(1);
              }
              return {
                value: key,
                type: 'reg'
              };
            } else {
              return {
                value: key
              };
            }
          });
        };
        index = $el.find('.btn-group .btn-success').index();
        typeList = ['line', 'bar', 'pie'];
        return {
          chart: typeList[index] || 'line',
          category: category,
          keys: convertKeys(keys)
        };
      }
    });
    StatsConfigsView = Backbone.View.extend({
      events: {
        'click .typeList li': 'selectType',
        'click .result .preview': 'preview',
        'click .statsConfig .add': 'add',
        'click .statsConfig .remove': 'remove',
        'click .result .save': 'save'
      },
      initialize: function() {
        var $el;
        debug('initialize StatsConfigsView');
        $el = this.$el;
        this.statsConfigHtml = $('<div />').append($el.find('.statsConfig').parent().clone()).html();
        this.timeConfigView = new TimeConfigView({
          el: $el.find('.dateConfig')
        });
        $el.find('.result input').focus(function() {
          return $(this).removeClass('notFilled');
        });
        this.statsParamsViewList = [];
        return this.createStatsConfig($el.find('.statsConfig'));
      },
      selectType: function(e) {
        var obj;
        obj = $(e.currentTarget);
        if (obj.hasClass('selected')) {
          return;
        }
        obj.siblings('.selected').addBack().toggleClass('selected');
        return _.each(this.statsParamsViewList, function(statsParamsView) {
          return statsParamsView.enableTypeSelect(obj.data('type'));
        });
      },
      add: function() {
        var obj;
        obj = $(this.statsConfigHtml);
        obj.find('.add').addClass('hidden');
        obj.find('.remove').removeClass('hidden');
        obj.insertBefore(this.$el.find('.row').children(':last'));
        return this.createStatsConfig(obj.find('.statsConfig'));
      },
      remove: function(e) {
        var index, obj, tmp;
        obj = $(e.currentTarget).closest('.statsConfig');
        index = this.$el.find('.statsConfig').index(obj);
        tmp = this.statsParamsViewList.splice(index, 1)[0];
        obj.parent().remove();
        return tmp.remove();
      },
      createStatsConfig: function(obj) {
        var $el, statsParamsView;
        debug('createStatsConfig');
        $el = this.$el;
        statsParamsView = new StatsParamsView({
          el: obj,
          statsType: $el.find('.typeList .selected').data('type')
        });
        return this.statsParamsViewList.push(statsParamsView);
      },
      selectCategory: function(categorySelector, keySelector) {
        var category;
        debug('selectCategory');
        category = categorySelector.val();
        if (this._xhr) {
          this._xhr.abort();
        }
        this._xhr = $.getJSON("/collection/" + category + "/keys", (function(_this) {
          return function(data) {
            _this._xhr = null;
            return keySelector.options(data);
          };
        })(this));
        return this;
      },
      getOptions: function() {
        var $el, config, desc, name, stats, statsNameInput, timeConfig, type;
        $el = this.$el;
        type = $el.find('.typeList .selected').data('type');
        timeConfig = this.timeConfigView.getConfig();
        if (!timeConfig) {
          return;
        }
        stats = [];
        _.each(this.statsParamsViewList, function(statsParamsView) {
          var params;
          params = statsParamsView.getParams();
          if (params) {
            return stats.push(params);
          }
        });
        if (stats.length !== this.statsParamsViewList.length) {
          return;
        }
        statsNameInput = $el.find('.statsName input');
        name = statsNameInput.val().trim();
        desc = $el.find('.desc input').val().trim();
        config = {
          name: name,
          stats: stats,
          point: {
            interval: timeConfig.interval
          },
          type: type,
          date: {
            start: timeConfig.start,
            end: timeConfig.end
          },
          desc: desc
        };
        debug('config %j', config);
        return config;
      },
      save: function() {
        var $el, options, result, statsNameInput;
        options = this.getOptions();
        if (!options) {
          return;
        }
        $el = this.$el;
        statsNameInput = $el.find('.statsName input');
        if (!options.name) {
          statsNameInput.addClass('notFilled');
          return;
        }
        if (user.get('anonymous')) {
          user.logIn();
          return;
        }
        result = $el.find('.saveResult');
        console.dir(options);
        return $.ajax({
          url: '/config',
          type: 'post',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(options)
        }).success(function(res) {
          return result.removeClass('hidden alert-danger').addClass('alert-success').html('已成功保证该统计配置！');
        }).error(function(res) {
          return result.removeClass('hidden alert-success').addClass('alert-danger').html('保存统计配置失败！');
        });
      },
      preview: function() {
        var obj, options;
        options = this.getOptions();
        if (!options) {
          return;
        }
        if (this.chartView) {
          this.chartView.remove();
        }
        obj = $('<div class="chartView" />');
        obj.attr('title', options.desc);
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
      }
    });
    return new StatsConfigsView({
      el: $('.StatsConfigs')
    });
  });

}).call(this);
