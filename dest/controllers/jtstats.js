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
    return async.parallel({
      collections: function(cbf) {
        return mongodb.getCollectionNames(cbf);
      }
    }, function(err, result) {
      var collections;
      collections = _.filter(result.collections, function(collection) {
        return !~collection.indexOf('stats_');
      });
      if (err) {
        return cbf(err);
      } else {
        return cbf(null, {
          viewData: {
            page: 'jtstats',
            globalVariable: {
              collections: collections
            }
          }
        }, headerOptions);
      }
    });
  };

}).call(this);
