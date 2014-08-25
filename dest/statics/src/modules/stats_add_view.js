(function() {
  define('StatsAddView', ['jquery', 'underscore', 'Backbone'], function(require, exports, module) {
    var $, Backbone, StatsAddView, dateRowHtml, functionHtml, _;
    _ = require('underscore');
    $ = require('jquery');
    Backbone = require('Backbone');
    dateRowHtml = (function() {
      var dateInfos, getDateInputHtml, getPeriodSelectorHtml;
      getDateInputHtml = function(tips, placeholder) {
        return '<div class="col-xs-6 col-sm-4">' + '<div class="input-group">' + '<span class="input-group-addon">' + tips + '</span>' + '<input type="text" class="form-control" placeholder="' + placeholder + '">' + '</div>' + '</div>';
      };
      getPeriodSelectorHtml = function(dateInfos) {
        var dateTemplate, periodHtml;
        periodHtml = '<div class="col-xs-6 col-sm-4"><div class="btn-group dateList">';
        dateTemplate = _.template('<button type="button" class="btn btn-default" data-start="<%= start %>" data-end="<%= end %>"><%= text %></button>');
        _.each(dateInfos, function(info) {
          return periodHtml += dateTemplate(info);
        });
        return periodHtml += '</div></div>';
      };
      dateInfos = [
        {
          text: '当天',
          start: 0,
          end: 0
        }, {
          text: '7天',
          start: -6,
          end: 0
        }, {
          text: '15天',
          start: -14,
          end: 0
        }, {
          text: '30天',
          start: -29,
          end: 0
        }, {
          text: '当月',
          start: 'currentMonth',
          end: 0
        }
      ];
      return '<div class="row dateRow">' + getDateInputHtml('开始日期', '请输入开始日期(YYYY-MM-DD)') + getDateInputHtml('结束日期', '请输入结束日期(YYYY-MM-DD)') + getPeriodSelectorHtml(dateInfos) + '</div>';
    })();
    functionHtml = (function() {
      var btnTemplate, btns, getBtn, html;
      btnTemplate = _.template('<div class="col-xs-6 col-sm-4">' + '<button class="btn <%= itemClass %>"><%= name %></button>' + '</div>');
      getBtn = function(item) {
        return btnTemplate(item);
      };
      html = '<div class="row function">' + '<div class="col-xs-6 col-sm-4"><div class="input-group">' + '<span class="input-group-addon">名称</span>' + '<input type="text" class="form-control" placeholder="请输入该统计的名称">' + '</div></div>';
      btns = [
        {
          name: '预览',
          itemClass: 'preview btn-danger'
        }, {
          name: '保存',
          itemClass: 'save btn-success'
        }
      ];
      _.each(btns, function(btn) {
        return html += getBtn(btn);
      });
      return html += '</div>';
    })();
    StatsAddView = Backbone.View.extend({
      events: function() {
        return {
          'click .categorySelector .dropdown-menu li': 'selectCategory',
          'click .keySelector .dropdown-menu li': 'selectKey',
          'click .typeSelector .dropdown-menu li': 'selectType',
          'click .intervalSelector .dropdown-menu li': 'selectInterval',
          'click .dateList .btn': 'selectDate',
          'click .function .preview': 'preview',
          'click .function .save': 'save',
          'click .addCategory': 'addCategory',
          'click .deleteCategory': 'deleteCategory'
        };
      },
      initialize: function() {
        return this.render();
      },
      getSelector: function(items, itemClass, tips, defaultValue) {
        var html, ulHtml;
        if (defaultValue == null) {
          defaultValue = '';
        }
        ulHtml = '<ul class="dropdown-menu" role="menu">';
        _.each(items, function(item) {
          return ulHtml += '<li><a href="javascript:;"><span class="glyphicon"></span>' + item + '</a></li>';
        });
        ulHtml += '</ul>';
        html = '<div class="col-xs-6 col-sm-4 ' + itemClass + ' selector"><div class="input-group">' + '<div class="input-group-btn">' + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' + tips + '<span class="caret"></span>' + '</button>' + ulHtml + '</div>' + '<input type="text" class="form-control" value="' + defaultValue + '"></input>' + '</div></div>';
        return html;
      },
      getCategoryList: function() {
        return this.getSelector(JT_GLOBAL.collections, 'categorySelector', '请选择分类');
      },
      getTypeList: function() {
        return this.getSelector(['line', 'column', 'pie', 'gauge', 'columnFresh'], 'typeSelector', '请选择类型');
      },
      getIntervalList: function() {
        return this.getSelector(['1m', '10m', '30m', '1h', '2h', '6h', '12h', '1d'], 'intervalSelector', '请选择时间间隔(秒)', 60);
      },
      getKeyList: function(keys) {
        return this.getSelector(keys, 'keySelector', '请选择key');
      },
      addCategory: function() {
        var html;
        html = '<div class="row selectorList stats">' + this.getCategoryList() + this.getKeyList() + '<div class="col-xs-6 col-sm-4"><button class="deleteCategory btn btn-warning">删除</button></div>' + '</div>';
        this.$el.find('.selectorList:last').before(html);
        return this;
      },
      deleteCategory: function(e) {
        $(e.target).closest('.selectorList').remove();
        return this;
      },
      showKeySelector: function(collection, index) {
        $.ajax({
          url: "/collection/" + collection + "/keys",
          dataType: 'json'
        }).success((function(_this) {
          return function(res) {
            var isClickDropdownMenu, obj, selector;
            obj = $(_this.getKeyList(res));
            selector = _this.$el.find('.selectorList').find('.keySelector').eq(index);
            isClickDropdownMenu = false;
            obj.find('.dropdown-menu').on('click', function() {
              isClickDropdownMenu = true;
            });
            obj.find('.input-group-btn').on('hide.bs.dropdown', function(e) {
              if (isClickDropdownMenu) {
                e.preventDefault();
              }
              isClickDropdownMenu = false;
            });
            selector.after(obj);
            return selector.remove();
          };
        })(this)).error(function(res) {});
        return this;
      },
      selectKey: function(e) {
        var arr, obj, selectedItems;
        obj = $(e.target);
        obj.toggleClass('selected');
        obj.find('.glyphicon').toggleClass('glyphicon-ok');
        selectedItems = obj.closest('.dropdown-menu').find('.selected');
        arr = _.map(selectedItems, function(item) {
          return $(item).text();
        });
        obj.closest('.keySelector').find('input').val(arr.join(','));
        return e.preventDefault();
      },
      selectType: function(e) {
        var obj, type;
        obj = $(e.target);
        type = obj.text();
        return this.$el.find('.typeSelector input').val(type);
      },
      selectCategory: function(e) {
        var category, categorySelector, index, obj;
        obj = $(e.target);
        category = obj.text();
        categorySelector = obj.closest('.categorySelector');
        categorySelector.find('input').val(category);
        index = this.$el.find('.categorySelector').index(categorySelector);
        return this.showKeySelector(category, index);
      },
      selectDate: function(e) {
        var end, inputs, obj, start;
        obj = $(e.target);
        start = obj.data('start');
        end = obj.data('end');
        inputs = this.$el.find('.dateRow .form-control');
        inputs.eq(0).val(start);
        return inputs.eq(1).val(end);
      },
      selectInterval: function(e) {
        var interval, unit, unitValues;
        interval = $(e.target).text();
        unitValues = {
          'm': 60,
          'h': 3600,
          'd': 24 * 3600
        };
        unit = unitValues[interval.charAt(interval.length - 1).toLowerCase()];
        return this.$el.find('.intervalSelector input').val(window.parseInt(interval) * unit);
      },
      preview: function() {
        var config;
        config = this.getConfig();
        if (config) {
          return this.trigger('preview', config);
        }
      },
      save: function() {
        var config;
        config = this.getConfig();
        if (config) {
          return $.ajax({
            url: '/config',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(config)
          }).success(function(res) {
            return console.dir(res);
          }).error(function(res) {
            return console.dir(res);
          });
        }
      },
      getConfig: function() {
        var arr, data, dateList, getKey, inputs, notFillItemIndex, setting, stats;
        inputs = this.$el.find('input');
        notFillItemIndex = -1;
        arr = _.map(inputs, function(input, i) {
          var val;
          input = $(input);
          val = input.val().trim();
          if (!val && !~notFillItemIndex) {
            notFillItemIndex = i;
          }
          return val;
        });
        if (~notFillItemIndex) {
          inputs.eq(notFillItemIndex).focus();
          this.trigger('error', '请填写统计配置参数，不能为空！');
          return;
        }
        getKey = function(key) {
          return _.map(key.split(','), function(key) {
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
        setting = this.$el.find('.selectorList.setting');
        dateList = this.$el.find('.dateRow input');
        stats = _.map(this.$el.find('.selectorList.stats'), function(item) {
          var obj;
          obj = $(item);
          inputs = obj.find('input');
          return {
            category: inputs.eq(0).val().trim(),
            key: getKey(inputs.eq(1).val().trim())
          };
        });
        data = {
          stats: stats,
          point: {
            interval: setting.find('.intervalSelector input').val().trim()
          },
          type: setting.find('.typeSelector input').val().trim(),
          date: {
            start: dateList.eq(0).val().trim(),
            end: dateList.eq(1).val().trim()
          },
          name: this.$el.find('.function input').val().trim()
        };
        console.dir(JSON.stringify(data));
        return data;
      },
      render: function() {
        var html;
        html = '<h1 class="page-header">Add</h1>' + '<div class="row selectorList stats">' + this.getCategoryList() + this.getKeyList() + '<div class="col-xs-6 col-sm-4"><button class="addCategory btn btn-primary">增加</button></div>' + '</div>' + '<div class="row selectorList setting">' + this.getIntervalList() + this.getTypeList() + '</div>' + dateRowHtml + functionHtml;
        return this.$el.html(html);
      }
    });
    module.exports = StatsAddView;
  });

}).call(this);
