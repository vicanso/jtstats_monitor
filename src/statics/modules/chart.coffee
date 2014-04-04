define 'chart', (require, exports) ->

  Highcharts.setOptions {
    global : 
      useUTC : false
    tooltip : 
      valueDecimals : 2
    rangeSelector : 
      selected : 5
      inputEnabled : false
    title :
      text : 'JT STATS'
  }
  exports.show = (jqObj, data) ->
    jqObj.highcharts 'StockChart', {
      legend :
        layout : 'vertical'
        align : 'right'
        verticalAlign : 'middle'
        borderWidth : 0
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