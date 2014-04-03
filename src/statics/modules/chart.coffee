define 'chart', ['jquery'], (require, exports) ->

  Highcharts.setOptions {
    global : 
      useUTC : false
  }
  exports.show = (jqObj, data) ->
    jqObj.highcharts 'StockChart', {
      rangeSelector : 
        selected : 1
        inputEnabled : false
      title :
        text : 'JT STATS'
      series : data
    }

  return



    #   $('#container').highcharts('StockChart', {
      

    #   rangeSelector : {
    #     selected : 1,
    #     inputEnabled: false
    #   },

    #   title : {
    #     text : 'AAPL Stock Price'
    #   },
      
    #   series : [{
    #     name : 'AAPL',
    #     data : data,
    #     tooltip: {
    #       valueDecimals: 2
    #     }
    #   }]
    # });