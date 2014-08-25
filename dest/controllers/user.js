(function() {
  var User, async, config, createUser, crypto, getHashKey, getInfo, getUserInfo, logger, modifyUser, moment, mongodb, pickUserInfo, randomCodes, url, _;

  mongodb = require('../helpers/mongodb');

  config = require('../config');

  async = require('async');

  url = require('url');

  moment = require('moment');

  _ = require('underscore');

  crypto = require('crypto');

  User = mongodb.model('stats_user');

  logger = require('../helpers/logger')(__filename);

  randomCodes = (function() {
    var arr, i, _i;
    arr = [];
    for (i = _i = 48; _i <= 122; i = ++_i) {
      arr.push(String.fromCharCode(i));
    }
    return arr;
  })();

  getHashKey = function() {
    var arr;
    arr = _.shuffle(randomCodes);
    arr.length = 10;
    return arr.join('');
  };

  module.exports = function(req, res, cbf) {
    var data, method, user;
    method = req.method;
    user = req.session;
    data = req.body;
    switch (method) {
      case 'GET':
        return getUserInfo(req, cbf);
      case 'POST':
      case 'PUT':
        if (data.type === 'register') {
          return createUser(req, cbf);
        } else {
          return modifyUser(req, cbf);
        }
        break;
      case 'DELETE':
        user = {
          anonymous: true,
          hash: getHashKey(),
          ip: req.ip
        };
        req.session.user = user;
        return cbf(null, pickUserInfo(user));
    }
  };

  getUserInfo = function(req, cbf) {
    var user, _ref;
    if (req.param('cache') !== 'false') {
      res.redirect(302, '/user?cache=false');
    }
    user = ((_ref = req.session) != null ? _ref.user : void 0) || {
      anonymous: true,
      hash: getHashKey()
    };
    req.session.user = user;
    return cbf(null, pickUserInfo(user));
  };

  pickUserInfo = function(data) {
    return _.pick(data, ['anonymous', 'name', 'hash', 'id', 'sets']);
  };

  getInfo = function(req, data) {
    return {
      name: data.name,
      id: data.name,
      sets: data.sets,
      ip: req.ip,
      anonymous: false,
      hash: getHashKey()
    };
  };

  modifyUser = function(req, cbf) {
    var data, hash, _ref, _ref1;
    data = req.body;
    hash = (_ref = req.session) != null ? (_ref1 = _ref.user) != null ? _ref1.hash : void 0 : void 0;
    if (!hash) {
      return cbf(new Error('the hash is null'));
    } else {
      return async.waterfall([
        function(cbf) {
          return User.findOne({
            name: data.name
          }, cbf);
        }, function(doc, cbf) {
          var shasum;
          if (!doc) {
            cbf(new Error('the user is not exists'));
            return;
          }
          shasum = crypto.createHash('sha1');
          shasum.update("" + doc.pwd + "_" + hash);
          if (data.pwd === shasum.digest('hex')) {
            req.session.user = getInfo(req, doc);
            return cbf(null, pickUserInfo(req.session.user));
          } else {
            return cbf(new Error('the password is wrong'));
          }
        }
      ], cbf);
    }
  };

  createUser = function(req, cbf) {
    var data;
    data = req.body;
    return async.waterfall([
      function(cbf) {
        return User.findOne({
          name: data.name
        }, cbf);
      }, function(doc, cbf) {
        if (doc) {
          return cbf(new Error('the user is exists'));
        } else {
          return new User(data).save(function(err, res) {
            if (err) {
              return cbf(err);
            } else {
              req.session.user = getInfo(req, data);
              return cbf(null, {
                message: 'success'
              });
            }
          });
        }
      }
    ], cbf);
  };

}).call(this);
