seajs.use ['jquery', 'underscore', 'Backbone', 'user'], ($, _, Backbone, user) ->

  user.create {
    name : 'vicanso'
    pwd : 'oajfoeajfeo'
  }, (err, res) ->
    console.dir err
    console.dir res