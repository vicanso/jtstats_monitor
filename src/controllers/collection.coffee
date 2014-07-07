mongodb = require '../helpers/mongodb'
config = require '../config'
async = require 'async'
moment = require 'moment'
_ = require 'underscore'
logger = require('../helpers/logger') __filename


module.exports = (req, res, cbf) ->
  maxAge = 600
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  collection = req.param 'collection'
  console.dir collection



  # var mapOptions = {
  #   query : conditions,
  #   scope : {
  #     groupByDept : groupByDept,
  #     groupByOrg : groupByOrg,
  #     isMergeMode : isMergeMode
  #   },
  #   map : function(){

  #     if(isMergeMode){
  #       var name = '__' + this.dept_name;
  #       if(groupByDept || groupByOrg){
  #         name += ('__' + this.org_name);
  #       }
  #     }else{
  #       var name = this.busi_flag_name;
  #       if(groupByOrg){
  #         name += ('__' + this.dept_name + '__' + this.org_name);
  #       }else if(groupByDept){
  #         name += ('__' + this.dept_name);
  #       }
  #     }
  #     // if(this.busi_flag_name == '修改个人信息――修改柜台手机号'){
  #     //   this.busi_count_counter = 0;
  #     // }
      
  #     emit(name, this);
  #   },
  #   reduce : function(k, vals){
  #     var arr = ['busi_count_other', 'busi_count_counter', 'busi_count_wx', 'busi_count_internet', 'busi_count_mobile', 'busi_count_ytj', 'busi_count_ele'];
  #     var result = {};
  #     for(var i = 0; i < arr.length; i++){
  #       result[arr[i]] = 0;
  #     }
  #     for(var i = 0, len = vals.length; i < len; i++){
  #       var val = vals[i];
  #       for(var j = 0; j < arr.length; j++){
  #         var name = arr[j];
  #         result[name] += parseInt(val[name]);
  #       }
  #     }
  #     return result;
  #   }
  # };

  mapOptions = 
    map : ->
      emit 'key', this.key
    reduce : (k, vals) ->
      {
        keys : Array.unique vals
      }

  async.waterfall [
    (cbf) ->
      mongodb.model(collection).mapReduce mapOptions, (err, result) ->
        cbf err, result
    (result, cbf) ->
      keys = _.sortBy result?[0]?.value.keys, (key) ->
        key
      cbf null, keys, headerOptions
  ], cbf
