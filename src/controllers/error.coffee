config = require '../config'
JTError = require '../helpers/jterror'
module.exports = (err, req, res, next) ->
  err = new JTError err if !(err instanceof JTError)
  if 'json' == req.accepts ['html', 'json']
    data = err.toJSON()
    delete data.stack if config.env != 'development'
    res.json err.statusCode, data
  else
    res.render 'error', {
      viewData : err.toJSON()
    }