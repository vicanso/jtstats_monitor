(function() {
  var JTError, config;

  config = require('../config');

  JTError = require('../helpers/jterror');

  module.exports = function(err, req, res, next) {
    var data;
    if (!(err instanceof JTError)) {
      err = new JTError(err);
    }
    if ('json' === req.accepts(['html', 'json'])) {
      data = err.toJSON();
      if (config.env !== 'development') {
        delete data.stack;
      }
      return res.json(err.statusCode, data);
    } else {
      return res.render('error', {
        viewData: err.toJSON()
      });
    }
  };

}).call(this);
