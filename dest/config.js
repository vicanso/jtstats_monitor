(function() {
  var program;

  program = require('commander');

  (function() {
    return program.version('0.0.1').option('-p, --port <n>', 'listen port', parseInt).option('--log <n>', 'the log file').option('--mongodb <n>', 'mongodb uri').option('--redis <n>', 'redis uri').parse(process.argv);
  })();

  exports.port = program.port || 10000;

  exports.env = process.env.NODE_ENV || 'development';


  /**
   * [staticUrlPrefix 静态文件url前缀]
   * @type {String}
   */

  exports.staticUrlPrefix = '/static';

  exports.redis = (function() {
    var redisUri, url, urlInfo;
    url = require('url');
    redisUri = program.redis || 'redis://localhost:10010';
    urlInfo = url.parse(redisUri);
    return {
      port: urlInfo.port,
      host: urlInfo.hostname,
      password: urlInfo.auth
    };
  })();

  exports.session = {
    secret: 'jenny&tree',
    key: 'vicanso',
    ttl: 3600
  };

  module.exports.mongodbUri = program.mongodb || 'mongodb://localhost:10020/test';

}).call(this);
