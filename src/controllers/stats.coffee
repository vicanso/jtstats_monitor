_ = require 'underscore'
async = require 'async'
moment = require 'moment'
mongodb = require '../helpers/mongodb'

module.exports = (req, res, cbf) ->
  key = req.param 'key'
  start = req.param 'start'
  end = req.param 'end'
  if start
    start = moment start, 'YYYY-MM-DDTHH:mm:ss'
  if end
    end = moment end, 'YYYY-MM-DDTHH:mm:ss'

  infos = key.split '.'
  collection = infos[0]
  category = infos[1]
  tag = infos[2]
  query = {}
  if infos[1]
    query.category = infos[1]
  if infos[2]
    query.tag = infos[2]
  if end
    query.date = 
      '$gte' : start.format 'YYYY-MM-DD'
      '$lte' : end.format 'YYYY-MM-DD'
  else if start
    query.date = start.format 'YYYY-MM-DD'
  async.waterfall [
    (cbf) ->
      mongodb.find 'haproxy', query, cbf
    (docs, cbf) ->
      result = []
      _.each docs, (doc) ->
        doc = doc.toObject()
        result = result.concat formatData doc
      cbf null, result
  ], cbf


formatData = (doc) ->
  date = moment doc.date, 'YYYY-MM-DD'
  timestamp = date.valueOf()
  values = doc.values
  arr = []
  _.each values, (value) ->
    index = Math.floor (value.t - timestamp) / (10 * 1000)
    arr[index] = [value.t, value.v]
  _.compact arr


# mergeArr = (arr, mergeSize) ->
  

getFillArr = (size, value) ->
  arr = []
  while size--
    arr.push 0
  arr
