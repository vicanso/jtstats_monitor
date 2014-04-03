jtRouter = require 'jtrouter'
config = require '../config'
headerOptions = 
  'Cache-control' : 'no-cache'
module.exports = (err, req, res, next) ->
  if config.getENV() == 'production'
    jtRouter.render req, res, 'error', {
      viewData : 
        error : err
    }, headerOptions, next
  else
    next err