(function() {
  var Config, Set, User, add, async, config, get, mongodb, _;

  mongodb = require('../helpers/mongodb');

  config = require('../config');

  async = require('async');

  _ = require('underscore');

  Set = mongodb.model('stats_set');

  User = mongodb.model('stats_user');

  Config = mongodb.model('stats_config');

  add = function(req, cbf) {
    var data, user, _ref;
    data = req.body;
    user = (_ref = req.session) != null ? _ref.user : void 0;
    if (!user.name) {
      return cbf(new Error('is not login'));
    }
    data.creator = user.name;
    return async.waterfall([
      function(cbf) {
        return Set.findOne({
          name: data.name
        }, cbf);
      }, function(doc, cbf) {
        if (doc) {
          return cbf(new Error('the name is exists'));
        } else {
          return new Set(data).save(cbf);
        }
      }, function(doc, numberAffected, cbf) {
        var conditions, update;
        update = {
          '$push': {
            'sets': doc._id
          }
        };
        conditions = {
          name: user.name
        };
        return User.findOneAndUpdate(conditions, update, cbf);
      }, function(doc, cbf) {
        user.sets = doc.sets;
        return cbf(null, {
          message: 'success'
        });
      }
    ], cbf);
  };

  get = function(req, cbf) {
    var headerOptions, id, maxAge;
    maxAge = 600;
    if (config.env === 'development') {
      maxAge = 0;
    }
    headerOptions = {
      'Cache-Control': "public, max-age=" + maxAge
    };
    id = req.param('id');
    return async.waterfall([
      function(cbf) {
        return Set.findById(id, cbf);
      }, function(doc, cbf) {
        var funcs;
        if (!doc) {
          return cbf(new Error("can not find doc by " + id));
        }
        funcs = _.map(_.pluck(doc.configs, 'id'), function(id) {
          return function(cbf) {
            return Config.findById(id, cbf);
          };
        });
        return async.parallel(funcs, function(err, docs) {
          var data;
          if (err) {
            return cbf(err);
          } else {
            data = doc.toObject();
            _.each(docs, function(tmp, i) {
              data.configs[i] = _.extend(tmp.toObject(), data.configs[i]);
            });
            return cbf(null, data, headerOptions);
          }
        });
      }
    ], cbf);
  };

  module.exports = function(req, res, cbf) {
    switch (req.method) {
      case 'GET':
        return get(req, cbf);
      case 'POST':
        return add(req, cbf);
    }
  };

}).call(this);
