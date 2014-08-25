(function() {
  define('chart', ['jquery', 'underscore', 'echarts', 'moment', 'stats'], function(require, exports, module) {
    var $, average, convertData, daySeconds, defaultOption, defaultPieOption, defaultTheme, echarts, formatTime, getDataZoom, mergeTimeList, moment, sum, _;
    _ = require('underscore');
    $ = require('jquery');
    echarts = require('echarts');
    moment = require('moment');
    daySeconds = 24 * 3600;
    defaultOption = {
      tooltip: {
        trigger: 'axis'
      },
      calculable: true,
      toolbox: {
        show: true,
        feature: {
          mark: {
            show: true
          },
          dataView: {
            show: true
          },
          magicType: {
            show: true,
            type: ['line', 'bar']
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },
      yAxis: [
        {
          type: 'value'
        }
      ],
      animation: false
    };
    defaultPieOption = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      toolbox: {
        show: true,
        feature: {
          mark: {
            show: true
          },
          dataView: {
            show: true
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        },
        calculable: true
      }
    };

    /**
     * [sum description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    sum = function(data) {
      return _.reduce(data, function(memo, num) {
        return memo + num;
      }, 0);
    };

    /**
     * [average description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    average = function(data) {
      var total;
      total = sum(data);
      return Math.round(total / data.length);
    };
    mergeTimeList = function(data) {
      var result, tmpArrList;
      tmpArrList = _.map(data, function(item) {
        return _.pluck(item.values, 't');
      });
      result = tmpArrList.shift();
      _.each(tmpArrList, function(arr) {
        return _.each(arr, function(time, i) {
          var index;
          index = _.sortedIndex(result, time);
          if (result[index] !== time) {
            return result.splice(index, 0, time);
          }
        });
      });
      return result;
    };
    convertData = function(data, timeList) {
      var i, result, valuesList, _i, _ref;
      valuesList = _.pluck(data, 'values');
      result = [];
      for (i = _i = 0, _ref = valuesList.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        result.push([]);
      }
      _.each(timeList, function(time) {
        return _.each(valuesList, function(values, i) {
          var value, _ref1;
          if (((_ref1 = values[0]) != null ? _ref1.t : void 0) === time) {
            value = values.shift();
            return result[i].push(value.v);
          } else {
            return result[i].push(0);
          }
        });
      });
      return result;
    };
    formatTime = function(timeList, interval) {
      var formatStr;
      formatStr = 'YYYY-MM-DD HH:mm:ss';
      if (interval) {
        if (interval % daySeconds === 0) {
          formatStr = 'YYYY-MM-DD';
        } else if (interval % 3600 === 0) {
          formatStr = 'YYYY-MM-DD HH';
        } else if (interval % 60 === 0) {
          formatStr = 'YYYY-MM-DD HH:mm';
        }
      }
      return _.map(timeList, function(time) {
        return moment(time * 1000).format(formatStr);
      });
    };
    getDataZoom = function(total) {
      var onePagePoionts;
      onePagePoionts = 50;
      if (total > onePagePoionts) {
        return {
          show: true,
          realtime: true,
          start: 100 - Math.floor(onePagePoionts * 100 / total),
          end: 100
        };
      } else {
        return null;
      }
    };

    /**
     * [line 折线图]
     * @param  {[type]} dom     [description]
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    exports.line = function(dom, data, options) {
      var currentOptions, myChart, series, timeList, values;
      if (!(data != null ? data.length : void 0)) {
        return;
      }
      timeList = mergeTimeList(data);
      values = convertData(data, timeList);
      timeList = formatTime(timeList, options != null ? options.interval : void 0);
      series = _.map(data, function(item, i) {
        return {
          name: item.key,
          type: item.chart,
          data: values[i]
        };
      });
      currentOptions = _.extend({}, defaultOption, {
        legend: {
          data: _.pluck(data, 'key')
        },
        dataZoom: getDataZoom(timeList.length),
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: timeList
          }
        ],
        series: series
      }, options);
      myChart = echarts.init(dom, defaultTheme);
      return myChart.setOption(currentOptions, true);
    };

    /**
     * [barVertical 柱状图]
     * @type {[type]}
     */
    exports.barVertical = exports.line;

    /**
     * [stack 堆积图]
     * @param  {[type]} dom     [description]
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    exports.stack = function(dom, data, options) {
      var currentOptions, myChart, series, timeList, values;
      if (!(data != null ? data.length : void 0)) {
        return;
      }
      timeList = mergeTimeList(data);
      values = convertData(data, timeList);
      timeList = formatTime(timeList, options != null ? options.interval : void 0);
      series = _.map(data, function(item, i) {
        return {
          name: item.key,
          type: item.chart,
          stack: '总量',
          data: values[i]
        };
      });
      currentOptions = _.extend({}, defaultOption, {
        legend: {
          data: _.pluck(data, 'key')
        },
        dataZoom: getDataZoom(timeList.length),
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: timeList
          }
        ],
        series: series
      }, options);
      myChart = echarts.init(dom, defaultTheme);
      return myChart.setOption(currentOptions, true);
    };

    /**
     * [stackBarVertical 堆积柱状图]
     * @type {[type]}
     */
    exports.stackBarVertical = exports.stack;

    /**
     * [barHorizontal 条形图]
     * @param  {[type]} dom     [description]
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    exports.barHorizontal = function(dom, data, options, isStack) {
      var currentOptions, myChart, series, timeList, values;
      if (isStack == null) {
        isStack = false;
      }
      if (!(data != null ? data.length : void 0)) {
        return;
      }
      timeList = mergeTimeList(data);
      values = convertData(data, timeList);
      timeList = formatTime(timeList, options != null ? options.interval : void 0);
      series = _.map(data, function(item, i) {
        var tmp;
        tmp = {
          name: item.key,
          type: item.chart,
          data: values[i]
        };
        if (isStack) {
          tmp.stack = '总量';
        }
        return tmp;
      });
      currentOptions = _.extend({}, defaultOption, {
        legend: {
          data: _.pluck(data, 'key')
        },
        dataZoom: getDataZoom(timeList.length),
        xAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.01]
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: timeList
          }
        ],
        series: series
      }, options);
      myChart = echarts.init(dom, defaultTheme);
      return myChart.setOption(currentOptions, true);
    };

    /**
     * [stackBarHorizontal 堆积条纹图]
     * @param  {[type]} dom     [description]
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    exports.stackBarHorizontal = function(dom, data, options) {
      return exports.barHorizontal(dom, data, options, true);
    };

    /**
     * [pie 饼图]
     * @param  {[type]} dom    [description]
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}        [description]
     */
    exports.pie = function(dom, data, options) {
      var myChart, _ref;
      data = _.map(data, function(item) {
        var value, values;
        values = _.pluck(item.values, 'v');
        switch (item.type) {
          case 'counter':
            value = sum(values);
            break;
          case 'average':
            value = average(values);
            break;
          case 'gauge':
            value = _.last(values);
        }
        return {
          name: item.key,
          value: value
        };
      });
      options = _.extend({}, defaultPieOption, {
        legend: {
          data: _.pluck(data, 'name'),
          orient: 'vertical',
          x: 'left',
          y: '30px'
        },
        series: [
          {
            name: options != null ? (_ref = options.title) != null ? _ref.text : void 0 : void 0,
            type: 'pie',
            data: data
          }
        ],
        animation: false
      }, options);
      myChart = echarts.init(dom, defaultTheme);
      return myChart.setOption(options, true);
    };

    /**
     * [nestedPie 嵌套饼图]
     * @param  {[type]} dom     [description]
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    exports.nestedPie = function(dom, data, options) {};

    /**
     * [gauge 仪表盘]
     * @param  {[type]} dom     [description]
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    exports.gauge = function(dom, data, options) {
      var currentOptions, myChart;
      currentOptions = _.extend({
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        }
      }, options);
      currentOptions.series = _.map(data, function(item) {
        return {
          name: item.key,
          type: 'gauge',
          detail: {
            formatter: '{value}'
          },
          data: [
            {
              value: item.values[0].v
            }
          ]
        };
      });
      myChart = echarts.init(dom, defaultTheme);
      return myChart.setOption(currentOptions);
    };

    /**
     * [funnel 漏斗图]
     * @param  {[type]} dom     [description]
     * @param  {[type]} data    [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    exports.funnel = function(dom, data, options) {
      var currentOptions, maxValue, myChart;
      data = _.map(data, function(item) {
        var value, values;
        values = _.pluck(item.values, 'v');
        switch (item.type) {
          case 'counter':
            value = sum(values);
            break;
          case 'average':
            value = average(values);
            break;
          case 'gauge':
            value = _.last(values);
        }
        return {
          name: item.key,
          value: value
        };
      });
      maxValue = 0;
      _.each(data, function(item) {
        if (item.value > maxValue) {
          maxValue = item.value;
        }
      });
      _.each(data, function(item) {
        item.value = Math.floor(item.value * 100 / maxValue);
      });
      console.dir(data);
      currentOptions = _.extend({
        title: options.title,
        tooltip: {
          trigger: 'item',
          formatter: "{b} : {c}%"
        },
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: true,
              readOnly: false
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        legend: {
          data: _.pluck(data, 'name')
        },
        calculable: true,
        series: [
          {
            type: 'funnel',
            data: data
          }
        ]
      });
      myChart = echarts.init(dom, defaultTheme);
      return myChart.setOption(currentOptions, true);
    };
    exports.columnFresh = function(obj, data, option, getData) {
      var currentOptions, dom, myChart;
      currentOptions = _.extend({
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        calculable: false,
        yAxis: [
          {
            type: 'value'
          }
        ]
      }, option);
      currentOptions.xAxis = [
        {
          type: 'category',
          data: _.pluck(data, 'key')
        }
      ];
      data = _.map(data, function(item) {
        return item.values[0].v;
      });
      currentOptions.series = [
        {
          type: 'bar',
          data: data
        }
      ];
      dom = $(obj).get(0);
      myChart = echarts.init(dom, defaultTheme);
      myChart.setOption(currentOptions, true);
      if (getData) {
        return setInterval(function() {
          return getData(function(err, data) {
            if (data) {
              data = _.map(data, function(item) {
                return item.values[0].v;
              });
              currentOptions.series[0].data = data;
              return myChart.setOption(currentOptions, true);
            }
          });
        }, 10 * 1000);
      }
    };
    defaultTheme = {
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa", "#07a2a4", "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553", "#c14089"],
      title: {
        itemGap: 8,
        textStyle: {
          fontWeight: "normal",
          color: "#008acd"
        }
      },
      legend: {
        itemGap: 8
      },
      dataRange: {
        itemWidth: 15,
        color: ["#2ec7c9", "#b6a2de"]
      },
      toolbox: {
        color: ["#1e90ff", "#1e90ff", "#1e90ff", "#1e90ff"],
        effectiveColor: "#ff4500",
        itemGap: 8
      },
      tooltip: {
        backgroundColor: "rgba(50,50,50,0.5)",
        axisPointer: {
          type: "line",
          lineStyle: {
            color: "#008acd"
          },
          crossStyle: {
            color: "#008acd"
          },
          shadowStyle: {
            color: "rgba(200,200,200,0.2)"
          }
        }
      },
      dataZoom: {
        dataBackgroundColor: "#efefff",
        fillerColor: "rgba(182,162,222,0.2)",
        handleColor: "#008acd"
      },
      grid: {
        borderColor: "#eee"
      },
      categoryAxis: {
        axisLine: {
          lineStyle: {
            color: "#008acd"
          }
        },
        splitLine: {
          lineStyle: {
            color: ["#eee"]
          }
        }
      },
      valueAxis: {
        axisLine: {
          lineStyle: {
            color: "#008acd"
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(250,250,250,0.1)", "rgba(200,200,200,0.1)"]
          }
        },
        splitLine: {
          lineStyle: {
            color: ["#eee"]
          }
        }
      },
      polar: {
        axisLine: {
          lineStyle: {
            color: "#ddd"
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(250,250,250,0.2)", "rgba(200,200,200,0.2)"]
          }
        },
        splitLine: {
          lineStyle: {
            color: "#ddd"
          }
        }
      },
      timeline: {
        lineStyle: {
          color: "#008acd"
        },
        controlStyle: {
          normal: {
            color: "#008acd"
          },
          emphasis: {
            color: "#008acd"
          }
        },
        symbol: "emptyCircle",
        symbolSize: 3
      },
      bar: {
        itemStyle: {
          normal: {
            borderRadius: 5
          },
          emphasis: {
            borderRadius: 5
          }
        }
      },
      line: {
        smooth: true,
        symbol: "emptyCircle",
        symbolSize: 3
      },
      k: {
        itemStyle: {
          normal: {
            color: "#d87a80",
            color0: "#2ec7c9",
            lineStyle: {
              width: 1,
              color: "#d87a80",
              color0: "#2ec7c9"
            }
          }
        }
      },
      scatter: {
        symbol: "circle",
        symbolSize: 4
      },
      radar: {
        symbol: "emptyCircle",
        symbolSize: 3
      },
      map: {
        itemStyle: {
          normal: {
            areaStyle: {
              color: "#ddd"
            },
            label: {
              textStyle: {
                color: "#d87a80"
              }
            }
          },
          emphasis: {
            areaStyle: {
              color: "#fe994e"
            },
            label: {
              textStyle: {
                color: "rgb(100,0,0)"
              }
            }
          }
        }
      },
      force: {
        itemStyle: {
          normal: {
            linkStyle: {
              strokeColor: "#1e90ff"
            }
          }
        }
      },
      chord: {
        padding: 4,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 1,
              color: "rgba(128, 128, 128, 0.5)"
            },
            chordStyle: {
              lineStyle: {
                width: 1,
                color: "rgba(128, 128, 128, 0.5)"
              }
            }
          },
          emphasis: {
            lineStyle: {
              width: 1,
              color: "rgba(128, 128, 128, 0.5)"
            },
            chordStyle: {
              lineStyle: {
                width: 1,
                color: "rgba(128, 128, 128, 0.5)"
              }
            }
          }
        }
      },
      gauge: {
        startAngle: 225,
        endAngle: -45,
        axisLine: {
          show: true,
          lineStyle: {
            color: [[0.2, "#2ec7c9"], [0.8, "#5ab1ef"], [1, "#d87a80"]],
            width: 10
          }
        },
        axisTick: {
          splitNumber: 10,
          length: 15,
          lineStyle: {
            color: "auto"
          }
        },
        axisLabel: {
          textStyle: {
            color: "auto"
          }
        },
        splitLine: {
          length: 22,
          lineStyle: {
            color: "auto"
          }
        },
        pointer: {
          width: 5,
          color: "auto"
        },
        title: {
          textStyle: {
            color: "#333"
          }
        },
        detail: {
          textStyle: {
            color: "auto"
          }
        }
      },
      textStyle: {
        fontFamily: "微软雅黑, Arial, Verdana, sans-serif"
      }
    };
  });

}).call(this);
