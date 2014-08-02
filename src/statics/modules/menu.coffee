define 'menu', ['jquery', 'underscore', 'Backbone', 'user', 'async', 'debug'], (require, exports, module) ->
  Backbone = require 'Backbone'
  _ = require 'underscore'
  user = require 'user'

  MenuView = Backbone.View.extend {
    events : 
      'click .logIn' : 'logIn'

    initialize : ->
      @listenTo user, 'status', @changeStatus
    logIn : ->
      user.logIn (err, res) ->

    changeStatus : (status) ->
      $el = @$el
      logIn = $el.find '.logIn'
      logOut = $el.find '.logOut'
      if status != 'logged'
        logIn.removeClass 'hidden'
        logOut.addClass 'hidden'
      else
        logIn.addClass 'hidden'
        logOut.removeClass 'hidden'

  }


  new MenuView {
    el : $ '.menuContainer'
  }