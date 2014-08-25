(function() {
  seajs.use(['jquery', 'underscore', 'Backbone', 'user', 'debug'], function($, _, Backbone, user, debug) {
    var ConfigsView, TemplateConfig, TemplateConfigList, TemplateConfigView;
    debug = debug('view:configs');
    debug('start run configsView');
    TemplateConfig = Backbone.Model.extend({
      defaults: {
        width: 4
      }
    });
    TemplateConfigList = Backbone.Collection.extend({
      model: TemplateConfig
    });
    TemplateConfigView = Backbone.View.extend({
      events: {
        'click .config .viewWidth .btn': 'changeViewWidth',
        'click .save': 'save'
      },
      initialize: function() {
        return this.listenTo(this.model, 'add remove', this.render);
      },
      changeViewWidth: function(e) {
        var cofingContainer, currentWidth, index, model, obj, width, widthArr;
        obj = $(e.currentTarget);
        index = obj.index() - 1;
        cofingContainer = obj.closest('.config').parent();
        model = this.model.at(cofingContainer.index());
        width = model.get('width');
        widthArr = [4, 6, 8, 12];
        currentWidth = widthArr[index];
        cofingContainer.addClass("col-xs-" + currentWidth).removeClass("col-xs-" + width);
        return model.set('width', currentWidth);
      },
      save: function(e) {
        var $el, configs, name, obj, setName;
        obj = $(e.currentTarget);
        if (obj.hasClass('saving')) {
          return;
        }
        $el = this.$el;
        setName = $el.find('.setName');
        name = setName.val().trim();
        if (!name) {
          setName.focus();
          return;
        }
        if (user.get('anonymous')) {
          user.logIn();
          return;
        }
        configs = _.map(this.model.toJSON(), function(item) {
          return _.pick(item, ['id', 'width']);
        });
        obj.text('保存中...');
        return $.ajax({
          url: '/set',
          type: 'post',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            name: name,
            configs: configs
          })
        }).success(function(res) {
          return obj.text('已成功保存');
        }).error(function(res) {
          return obj.text('保存失败');
        });
      },
      render: function() {
        var $el, data, htmlArr, itemTemplate;
        $el = this.$el;
        data = this.model.toJSON();
        if (!data.length) {
          $el.addClass('hidden');
          return;
        }
        itemTemplate = _.template('<div class="col-xs-<%= width %>"><div class="config">' + '<div class="name"><%= name %></div>' + '<div class="desc"><%= desc %></div>' + '<div class="btn-group viewWidth">' + '<button class="btn btn-default disabled">显示区域</button>' + '<button class="btn btn-default" type="button" title="占显示区域1/3"><span class="glyphicon glyphicon-align-left"></span></button>' + '<button class="btn btn-default" type="button" title="占显示区域1/2"><span class="glyphicon glyphicon-align-center"></span></button>' + '<button class="btn btn-default" type="button" title="占显示区域2/3"><span class="glyphicon glyphicon-align-right"></span></button>' + '<button class="btn btn-default" type="button" title="占满显示区域"><span class="glyphicon glyphicon-align-justify"></span></button>' + '</div>' + '</div></div>');
        htmlArr = [];
        _.each(data, function(item) {
          return htmlArr.push(itemTemplate(item));
        });
        $el.find('.panel-body .configs').html(htmlArr.join(''));
        return $el.removeClass('hidden');
      }
    });
    ConfigsView = Backbone.View.extend({
      events: {
        'click .preview': 'preview',
        'click .chartViewContainer .close': 'closePreview',
        'click .toggle': 'toggle'
      },
      initialize: function() {
        var $el;
        debug('initialize');
        $el = this.$el;
        this.templateConfigList = new TemplateConfigList();
        this.templateConfigView = new TemplateConfigView({
          model: this.templateConfigList,
          el: $el.find('.statsTemplateConfig')
        });
        return this;
      },
      toggle: function(e) {
        var id, isRemove, model, obj, trObj;
        obj = $(e.currentTarget);
        isRemove = obj.find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus').hasClass('glyphicon-plus');
        trObj = obj.closest('tr');
        id = trObj.data('id');
        if (isRemove) {
          model = this.templateConfigList.find(function(item) {
            return id === item.get('id');
          });
          this.templateConfigList.remove(model);
        } else {
          this.templateConfigList.add({
            id: trObj.data('id'),
            name: trObj.find('.name').text(),
            desc: '暂无该统计的描述'
          });
        }
        return this.closePreview();
      },
      closePreview: function() {
        if (this.chartView) {
          this.chartView.remove();
        }
        return this.$el.find('.chartViewContainer').addClass('hidden');
      },
      preview: function(e) {
        var $el, chartViewContainer, index, panel, tr;
        if (this.chartView) {
          this.chartView.remove();
        }
        $el = this.$el;
        tr = $(e.currentTarget).closest('tr');
        index = tr.index();
        chartViewContainer = $el.find('.chartViewContainer');
        panel = chartViewContainer.removeClass('hidden').find('.panel-body').html('loading...');
        return seajs.use('ChartView', (function(_this) {
          return function(ChartView) {
            var chartView, obj;
            obj = $('<div class="chartView" />');
            panel.empty().append(obj);
            chartView = new ChartView({
              el: obj
            });
            chartView.setOptions(JT_GLOBAL.configs[index]);
            chartView.show();
            _this.chartView = chartView;
          };
        })(this));
      }
    });
    return new ConfigsView({
      el: $('.statsConfigs')
    });
  });

}).call(this);
