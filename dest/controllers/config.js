(function() {
  var async, config, logger, moment, mongodb, _;

  mongodb = require('../helpers/mongodb');

  config = require('../config');

  async = require('async');

  moment = require('moment');

  _ = require('underscore');

  logger = require('../helpers/logger')(__filename);

  module.exports = function(req, res, cbf) {
    var Config, get, method, save, user, _ref;
    Config = mongodb.model('stats_config');
    method = req.method;
    save = function(data, name, cbf) {
      return async.waterfall([
        function(cbf) {
          return Config.findOne({
            name: data.name
          }, cbf);
        }, function(doc, cbf) {
          var err;
          if (doc) {
            err = new Error('the name has exists');
            return cbf(err);
          } else {
            data.creator = name;
            console.dir(JSON.stringify(data));
            return new Config(data).save(cbf);
          }
        }
      ], cbf);
    };
    get = function(query, cbf) {
      if (!query) {
        cbf(new Error('query can not be null'));
        return;
      }
      return Config.findOne(query, cbf);
    };
    switch (method) {
      case 'POST':
        user = (_ref = req.session) != null ? _ref.user : void 0;
        if (user != null ? user.name : void 0) {
          return save(req.body, user.name, cbf);
        } else {
          return cbf(new Error('user is not log in'));
        }
        break;
      case 'GET':
        return get(req.query, cbf);
    }
  };

}).call(this);
