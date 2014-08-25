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
            page: 'add',
            chartTypes: [
              {
                name: '折线图',
                type: 'line'
              }, {
                name: '堆积折线图',
                type: 'stack'
              }, {
                name: '柱状图',
                type: 'barVertical'
              }, {
                name: '条形图',
                type: 'barHorizontal'
              }, {
                name: '堆积柱状图',
                type: 'stackBarVertical'
              }, {
                name: '堆积条形图',
                type: 'stackBarHorizontal'
              }, {
                name: '标准饼图',
                type: 'pie'
              }, {
                name: '嵌套饼图',
                type: 'nestedPie'
              }, {
                name: '仪表盘',
                type: 'gauge'
              }, {
                name: '漏斗图',
                type: 'funnel'
              }
            ],
            globalVariable: {
              collections: collections
            }
          }
        }, headerOptions);
      }
    });
  };

}).call(this);
