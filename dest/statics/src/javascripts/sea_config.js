(function() {
  var filterModList, stats;

  seajs.config({
    base: CONFIG.staticUrlPrefix,
    alias: {
      'jtLazyLoad': 'components/jtlazy_load/dest/jtlazy_load.js',
      'stats': 'modules/stats.js',
      'chart': 'modules/chart.js',
      'StatsAddView': 'modules/stats_add_view.js',
      'ChartView': 'modules/chart_view.js',
      'user': 'modules/user.js',
      'widget': 'modules/widget.js',
      'crypto': 'modules/crypto.js'
    }
  });

  define('jquery', function() {
    return window.jQuery;
  });

  define('underscore', function() {
    return window._;
  });

  define('Backbone', function() {
    return window.Backbone;
  });

  define('moment', function() {
    return window.moment;
  });

  define('async', function() {
    return window.async;
  });

  define('echarts', function() {
    return window.echarts;
  });

  define('debug', function() {
    var debug;
    debug = window.debug;
    if (CONFIG.pattern) {
      debug.enable(CONFIG.pattern);
    } else {
      debug.disable();
    }
    return debug;
  });

  if (CONFIG.jsDebug > 0) {
    filterModList = ['jquery', 'underscore', 'Backbone', 'moment', 'async', 'echarts'];
    stats = function(obj, level) {
      var funcs;
      funcs = _.functions(obj);
      return _.each(funcs, function(func) {
        var start, tmp;
        start = new Date() - 0;
        tmp = _.wrap(obj[func], function() {
          var args, msg, originalFunc;
          args = _.toArray(arguments);
          originalFunc = args.shift();
          msg = "call " + func;
          if (level > 1) {
            msg += ", args:" + args;
          }
          originalFunc.apply(this, args);
          return console.log("" + msg + " use:" + (new Date() - start) + "ms");
        });
        obj[func] = tmp;
      });
    };
    seajs.on('exec', function(mod) {
      var id;
      id = mod.id;
      if (~_.indexOf(filterModList, id)) {
        return;
      }
      return stats(mod.exports, CONFIG.jsDebug);
    });
  }

}).call(this);
