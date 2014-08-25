(function() {
  var async, config, mongodb;

  mongodb = require('../helpers/mongodb');

  config = require('../config');

  async = require('async');

  module.exports = function(req, res, cbf) {
    var headerOptions, maxAge;
    maxAge = 600;
    if (config.env === 'development') {
      maxAge = 0;
    }
    headerOptions = {
      'Cache-Control': "public, max-age=" + maxAge
    };
    return async.waterfall([
      function(cbf) {
        return cbf(null, {
          viewData: {
            page: 'dashboard'
          }
        }, headerOptions);
      }
    ], cbf);
  };

}).call(this);
