seajs.config {
  base : CONFIG.staticUrlPrefix
  alias : 
    'jtLazyLoad' : 'components/jtlazy_load/dest/jtlazy_load.js'
    'stats' : 'modules/stats.js'
    'chart' : 'modules/chart.js'
    'StatsAddView' : 'modules/stats_add_view.js'
    'ChartView' : 'modules/chart_view.js'
    'user' : 'modules/user.js'
    'menu' : 'modules/menu.js'
    'widget' : 'modules/widget.js'
}


define 'jquery', ->
  window.jQuery

define 'underscore', ->
  window._

define 'Backbone', ->
  window.Backbone

define 'moment', ->
  window.moment

define 'async', ->
  window.async

define 'echarts', ->
  window.echarts


if CONFIG.jsDebug > 0
  filterModList = ['jquery', 'underscore', 'Backbone', 'moment', 'async', 'echarts']
  stats = (obj, level) ->
    funcs = _.functions obj
    _.each funcs, (func) ->
      start = new Date() - 0
      tmp = _.wrap obj[func], (originalFunc, args...) ->
        msg = "call #{func}"
        msg += ", args:#{args}" if level > 1
        originalFunc.apply @, args
        console.log "#{msg} use:#{new Date() - start}ms"
      obj[func] = tmp

  seajs.on 'exec', (mod) ->
    id = mod.id
    return if ~_.indexOf filterModList, id
    stats mod.exports, CONFIG.jsDebug 
