seajs.use ['jquery', 'underscore', 'Backbone', 'user', 'debug'], ($, _, Backbone, user, debug) ->
  debug = debug 'view:configs'
  debug 'start run configsView'


  TemplateConfig = Backbone.Model.extend {
    defaults : 
      width : 4
  }

  TemplateConfigList = Backbone.Collection.extend {
    model : TemplateConfig
  }

  TemplateConfigView = Backbone.View.extend {
    events : 
      'click .config .viewWidth .btn' : 'changeViewWidth'
      'click .save' : 'save'
    initialize : ->
      @listenTo @model, 'add remove', @render
    changeViewWidth : (e) ->
      obj = $ e.currentTarget
      index = obj.index() - 1
      cofingContainer = obj.closest('.config').parent()
      model = @model.at cofingContainer.index()
      width = model.get 'width'
      widthArr = [4, 6, 8, 12]
      currentWidth = widthArr[index]
      cofingContainer.addClass("col-xs-#{currentWidth}").removeClass "col-xs-#{width}"
      model.set 'width', currentWidth
    save : (e) ->
      obj = $ e.currentTarget
      return if obj.hasClass 'saving'
      $el = @$el
      setName = $el.find '.setName'
      name = setName.val().trim()
      if !name
        setName.focus()
        return
      if user.get 'anonymous'
        user.logIn()
        return
      configs = _.map @model.toJSON(), (item) ->
        _.pick item, ['id', 'width']
      obj.text '保存中...'
      $.ajax({
        url : '/set'
        type : 'post'
        dataType : 'json'
        contentType : 'application/json'
        data : JSON.stringify {
          name : name
          configs : configs
        }
      }).success((res)->
        obj.text '已成功保存'
      ).error (res) ->
        obj.text '保存失败'
    render : ->
      $el = @$el
      data = @model.toJSON()
      if !data.length
        $el.addClass 'hidden'
        return

      itemTemplate = _.template '<div class="col-xs-<%= width %>"><div class="config">' +
          '<div class="name"><%= name %></div>' +
          '<div class="desc"><%= desc %></div>' +
          '<div class="btn-group viewWidth">' +
            '<button class="btn btn-default disabled">显示区域</button>' +
            '<button class="btn btn-default" type="button" title="占显示区域1/3"><span class="glyphicon glyphicon-align-left"></span></button>' +
            '<button class="btn btn-default" type="button" title="占显示区域1/2"><span class="glyphicon glyphicon-align-center"></span></button>' +
            '<button class="btn btn-default" type="button" title="占显示区域2/3"><span class="glyphicon glyphicon-align-right"></span></button>' +
            '<button class="btn btn-default" type="button" title="占满显示区域"><span class="glyphicon glyphicon-align-justify"></span></button>' +
          '</div>' + 
        '</div></div>'
      htmlArr = []
      _.each data, (item) ->
        htmlArr.push itemTemplate item
      $el.find('.panel-body .configs').html htmlArr.join ''
      $el.removeClass 'hidden'
  }

  ConfigsView = Backbone.View.extend {
    events :
      'click .preview' : 'preview'
      'click .chartViewContainer .close' : 'closePreview'
      'click .toggle' : 'toggle'
    initialize : ->
      debug 'initialize'
      $el = @$el
      @templateConfigList = new TemplateConfigList()
      @templateConfigView = new TemplateConfigView {
        model : @templateConfigList
        el : $el.find '.statsTemplateConfig'
      }
      @
      # @listenTo @templateConfigList, 'add remove', @renderTempalteConfig

    toggle : (e) ->
      obj = $ e.currentTarget
      isRemove = obj.find('.glyphicon').toggleClass('glyphicon-plus glyphicon-minus').hasClass 'glyphicon-plus'
      trObj = obj.closest 'tr'
      id = trObj.data 'id'
      if isRemove
        model = @templateConfigList.find (item) ->
          id == item.get 'id'
        @templateConfigList.remove model
        # @templateConfigList = @templateConfigList.reject (item) ->
        #   id = item.get 'id'
      else
        @templateConfigList.add {
          id : trObj.data 'id'
          name : trObj.find('.name').text()
          desc : '暂无该统计的描述'
        }
      @closePreview()
    # renderTempalteConfig : ->
    #   console.dir @templateConfigList.toJSON()
    closePreview : ->
      @chartView.remove() if @chartView
      @$el.find('.chartViewContainer').addClass 'hidden'
    preview : (e) ->
      @chartView.remove() if @chartView
      $el = @$el
      tr = $(e.currentTarget).closest 'tr'
      index = tr.index()
      chartViewContainer = $el.find '.chartViewContainer'
      panel = chartViewContainer.removeClass('hidden').find('.panel-body').html 'loading...'
      seajs.use 'ChartView', (ChartView) =>
        obj = $ '<div class="chartView" />'
        panel.empty().append obj
        chartView = new ChartView {
          el : obj
        }
        chartView.setOptions JT_GLOBAL.configs[index]
        chartView.show()
        @chartView = chartView
        return

  }


  new ConfigsView {
    el : $ '.statsConfigs'
  }
  