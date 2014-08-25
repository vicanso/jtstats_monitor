(function() {
  define('widget', ['jquery', 'underscore', 'Backbone', 'debug'], function(require, exports, module) {
    var $, Backbone, SelectorModel, debug, _;
    _ = require('underscore');
    $ = require('jquery');
    Backbone = require('Backbone');
    debug = require('debug')('module:widget');
    SelectorModel = Backbone.Model.extend({
      defaults: {
        edit: false,
        placeholder: '',
        selectTips: '',
        multi: false
      }
    });
    exports.Selector = Backbone.View.extend({
      template: _.template('<div class="content">' + '<span class="glyphicon glyphicon-plus"></span>' + '<a class="edit" href="javascript:;"><span class="glyphicon glyphicon-edit"></span></a>' + '<div class="userInput hidden"><input type="text" placeholder="<%= placeholder %>" /></div>' + '<span class="selectInput">' + '<span class="placeholder"><%= selectTips %></span>' + '<span class="items"></span>' + '</span>' + '</div>' + '<ul class="selectList">' + '<div class="arrowTop1"></div>' + '<div class="arrowTop2"></div>' + '<%= html %>' + '</ul>'),
      colors: ['#0c92c9', '#0cc99a', '#ffd200', '#ff7f02', '#ff0202', '#ff02af', '#c20cff', '#4c16ff', '#1f63ff', '#28fff7'],
      events: {
        'click .selectList li': 'toggle',
        'click .content .edit': 'toggleEdit'
      },
      initialize: function(options) {
        options = _.omit(options, 'el');
        debug('initialize selector %j', options);
        this.model = new SelectorModel(options);
        this.listenTo(this.model, 'change:edit', this.editModeChange);
        this.listenTo(this.model, 'change:items', this.render);
        this.render();
        return this;
      },

      /**
       * [toggleEdit description]
       * @return {[type]} [description]
       */
      toggleEdit: function() {
        return this.model.set('edit', !this.model.get('edit'));
      },

      /**
       * [editModeChange 编辑模式修改]
       * @param  {[type]} model [description]
       * @param  {[type]} edit  [description]
       * @return {[type]}       [description]
       */
      editModeChange: function(model, edit) {
        var $el, selectInput, userInput;
        $el = this.$el;
        userInput = $el.find('.content .userInput');
        selectInput = $el.find('.content .selectInput');
        $el.find('.content .userInput, .content .selectInput').toggleClass('hidden');
        if (edit) {
          return $el.addClass('editMode');
        } else {
          return $el.removeClass('editMode');
        }
      },
      options: function(data) {
        if (data) {
          return this.model.set('items', data);
        } else {
          return this.model.get('items');
        }
      },
      getSelectListHtml: function() {
        var arr, liTemplate;
        liTemplate = _.template('<li><span class="checkIcon"></span><span class="dot" style="background-color:<%= color %>;"></span><%= name %></li>');
        arr = _.map(this.model.get('items'), (function(_this) {
          return function(item, i) {
            var color;
            color = _this.colors[i % _this.colors.length];
            return liTemplate({
              name: item,
              color: color
            });
          };
        })(this));
        return arr.join('');
      },

      /**
       * [toggle selector中的toggle]
       * @param  {[type]} e [description]
       * @return {[type]}   [description]
       */
      toggle: function(e) {
        var $el, arr, obj, placeholderObj, selectedItems;
        obj = $(e.currentTarget);
        if (this.model.get('multi')) {
          if (obj.hasClass('selected')) {
            obj.removeClass('selected');
            obj.find('.checkIcon').removeClass('glyphicon glyphicon-ok');
          } else {
            obj.addClass('selected');
            obj.find('.checkIcon').addClass('glyphicon glyphicon-ok');
          }
        } else if (!obj.hasClass('selected')) {
          obj.addClass('selected').find('.checkIcon').addClass('glyphicon glyphicon-ok');
          obj.siblings('.selected').removeClass('selected').find('.checkIcon').removeClass('glyphicon glyphicon-ok');
        }
        $el = this.$el;
        selectedItems = this.$el.find('.selectList .selected');
        arr = _.map(selectedItems, function(item) {
          item = $(item);
          return '<span class="item">' + item.html() + '</span>';
        });
        placeholderObj = $el.find('.content .placeholder');
        if (selectedItems.length) {
          placeholderObj.addClass('hidden');
        } else {
          placeholderObj.removeClass('hidden');
        }
        $el.find('.content .items').html(arr.join(''));
        return this.trigger('change');
      },

      /**
       * [render render模板]
       * @return {[type]} [description]
       */
      render: function() {
        var $el, data, html, placeholder, selectTips;
        $el = this.$el;
        html = this.getSelectListHtml();
        placeholder = this.model.get('placeholder');
        selectTips = this.model.get('selectTips');
        data = this.model.toJSON();
        data.html = html;
        return $el.addClass('uiSelector').html(this.template(data));
      },

      /**
       * [val description]
       * @return {[type]} [description]
       */
      val: function() {
        var values;
        if (this.model.get('edit')) {
          values = [this.$el.find('.content .userInput input').val().trim()];
        } else {
          values = _.map(this.$el.find('.content .items .item'), function(item) {
            return $(item).text();
          });
        }
        if (this.model.get('multi')) {
          return values;
        } else {
          return values[0];
        }
      },
      reset: function() {
        return this.render();
      }
    });
  });

}).call(this);
