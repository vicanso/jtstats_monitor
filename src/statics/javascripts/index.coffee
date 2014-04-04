modules = ['jquery', 'chart', 'utils']
seajs.use modules, ($, chart, utils) ->

  urls = [
    '/stats/haproxy.statusCode.404/2014-04-03/2014-04-04'
    # '/stats/haproxy.http.tc/2014-04-03'
  ]
  utils.get urls, (err, res) ->
    chart.show $('#contentContainer .chartContainer'), res if res
  # $.ajax({
  #   url : '/stats/haproxy.http.resTime/2014-04-03/2014-04-04'
  #   dataType : 'json'
  # }).success (res) ->
  #   chart.show $('#contentContainer .chartContainer'), [ res ]
  #   # $('#contentContainer .chartContainer'),.chartContainer {
  #   #   title : 
  #   # }
  #   console.dir res
  setTimeout ->
    seajs.emit 'loadComplete' if CONFIG.env == 'development'
  , 1
