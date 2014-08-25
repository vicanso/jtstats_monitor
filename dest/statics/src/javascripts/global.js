(function() {
  seajs.use(['jquery', 'underscore', 'async', 'user'], function($, _, async, user) {
    var HeaderView, MenuView;
    MenuView = Backbone.View.extend({
      events: {
        'click .logIn': 'logIn',
        'click .logOut': 'logOut'
      },
      initialize: function() {
        return this.listenTo(user, 'status', this.changeStatus);
      },
      logIn: function() {
        return user.logIn();
      },
      logOut: function() {
        return user.logOut();
      },
      changeStatus: function(status) {
        var $el, logIn, logOut;
        $el = this.$el;
        logIn = $el.find('.logIn');
        logOut = $el.find('.logOut');
        if (status !== 'logged') {
          logIn.removeClass('hidden');
          return logOut.addClass('hidden');
        } else {
          logIn.addClass('hidden');
          return logOut.removeClass('hidden');
        }
      }
    });
    HeaderView = Backbone.View.extend({
      initialize: function() {
        return this.listenTo(user, 'status', this.changeStatus);
      },
      changeStatus: function(status) {
        return this.$el.find('.name').text(user.get('name'));
      }
    });
    new MenuView({
      el: $('.menuContainer')
    });
    return new HeaderView({
      el: $('.headerContainer')
    });
  });

}).call(this);
