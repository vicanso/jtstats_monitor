seajs.use ['jquery', 'underscore', 'async', 'user'], ($, _, async, user) ->
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

  HeaderView = Backbone.View.extend {
    initialize : ->
      @listenTo user, 'status', @changeStatus
    changeStatus : (status) ->
      @$el.find('.name').text user.get 'name'
  }


  new MenuView {
    el : $ '.menuContainer'
  }

  new HeaderView {
    el : $ '.headerContainer'
  }
    