define 'utils', ['jquery'], (require, exports) ->
  $ = require 'jquery'

  exports.get = (urls, cbf) ->
    isSingle = false
    if !$.isArray urls
      urls = [urls]
      isSingle = true
    result = []
    total = urls.length
    completed = 0
    finish = ->
      completed++
      if completed == total
        if isSingle
          cbf null, result[0]
        else
          cbf null, result
    for url in urls
      $.ajax({
        url : url
      }).success((res) ->
        result.push res
        finish()
      ).error (res) ->
        finish()




  return