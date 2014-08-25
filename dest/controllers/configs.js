(function() {
  var async, config, mongodb, _;

  mongodb = require('../helpers/mongodb');

  config = require('../config');

  async = require('async');

  _ = require('underscore');

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
        return mongodb.model('stats_config').find({}, cbf);
      }, function(docs, cbf) {
        docs = _.map(docs, function(doc) {
          doc = doc.toObject();
          doc.stats = _.map(doc.stats, function(data) {
            delete data._id;
            return data;
          });
          return doc;
        });
        return cbf(null, {
          viewData: {
            page: 'configs',
            configs: docs,
            globalVariable: {
              configs: docs
            }
          }
        }, headerOptions);
      }
    ], cbf);
  };

}).call(this);
