(function() {
  var Schema, client, getModel, logger, modelDict, mongoose, path, requireTree, _;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  _ = require('underscore');

  requireTree = require('require-tree');

  logger = require('./logger')(__filename);

  path = require('path');

  client = null;

  modelDict = {};


  /**
   * [init description]
   * @param  {[type]} uri     [description]
   * @param  {[type]} options =             {} [description]
   * @return {[type]}         [description]
   */

  module.exports.init = function(uri, options) {
    var defaults;
    if (options == null) {
      options = {};
    }
    if (client) {
      return;
    }
    defaults = {
      db: {
        native_parser: true
      },
      server: {
        poolSize: 5
      }
    };
    _.extend(options, defaults);
    client = mongoose.createConnection(uri, options);
    client.on('connected', function() {
      return logger.info("" + uri + " connected");
    });
    client.on('disconnected', function() {
      return logger.info("" + uri + " disconnected");
    });
    return this.initModels(path.join(__dirname, '../models'));
  };


  /**
   * [initModels 初始化models]
   * @param  {[type]} modelPath [description]
   * @return {[type]}           [description]
   */

  module.exports.initModels = function(modelPath) {
    var models;
    if (!client) {
      throw new Error('the db is not init!');
    }
    models = requireTree(modelPath);
    return _.each(models, function(model, name) {
      var schema;
      name = model.name || (name.charAt(0).toUpperCase() + name.substring(1));
      schema = new Schema(model.schema, model.options);
      if (model.indexes) {
        _.each(model.indexes, function(indexOptions) {
          return schema.index.apply(schema, indexOptions);
        });
      }
      modelDict[name] = client.model(name, schema);
    });
  };


  /**
   * [model 获取mongoose的model]
   * @param  {[type]} collection [description]
   * @return {[type]}      [description]
   */

  module.exports.model = function(collection) {
    var model, schema;
    if (!client) {
      throw new Error('the db is not init!');
    }
    if (modelDict[collection]) {
      return modelDict[collection];
    } else {
      schema = new Schema({}, {
        safe: false,
        strict: false,
        collection: collection
      });
      schema.index([
        {
          key: 1
        }, {
          key: 1,
          date: 1
        }
      ]);
      model = client.model(collection, schema);
      modelDict[collection] = model;
      return model;
    }
  };

  module.exports.getCollectionNames = function(cbf) {
    if (!client) {
      return cbf(new Error('the db is not init!'));
    }
    return client.db.collectionNames(function(err, names) {
      var result;
      if (err) {
        return cbf(err);
      } else {
        result = [];
        _.each(names, function(info) {
          var infos, name;
          infos = info.name.split('.');
          infos.shift();
          name = infos.join('.');
          if (_.first(infos) !== 'system' && name !== 'configs') {
            return result.push(name);
          }
        });
        return cbf(null, result);
      }
    });
  };


  /**
   * [getModel 获取model]
   * @param  {String} collection
   * @return {[type]}
   */

  getModel = function(collection) {
    var model, schema;
    schema = new Schema({}, {
      safe: false,
      strict: false,
      collection: collection
    });
    schema.index([
      {
        key: 1
      }, {
        key: 1,
        date: 1
      }
    ]);
    model = client.model(collection, schema);
    modelDict[collection] = model;
    return model;
  };

}).call(this);
