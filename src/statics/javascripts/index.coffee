modules = ['jquery', 'chart']
seajs.use modules, ($, chart) ->


  $.ajax({
    url : '/stats/haproxy.http/2014-04-02/2014-04-03'
    dataType : 'json'
  }).success (res) ->
    chart.show $('#contentContainer .chartContainer'), [
      {
        name : 'haproxy.http.resTime'
        data : res
        tooltip : 
          valueDecimals : 2
      }
    ]
    # $('#contentContainer .chartContainer'),.chartContainer {
    #   title : 
    # }
    console.dir res
  setTimeout ->
    seajs.emit 'loadComplete' if CONFIG.env == 'development'
  , 1
