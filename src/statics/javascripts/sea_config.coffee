seajs.config {
  base : CONFIG.staticUrlPrefix
  alias : 
    'jtLazyLoad' : 'components/jtlazy_load/dest/jtlazy_load.js'
    'stats' : 'modules/stats.js'
    'chart' : 'modules/chart.js'
    'StatsAddView' : 'modules/stats_add_view.js'
    'ChartView' : 'modules/chart_view.js'
    'user' : 'modules/user.js'
    'widget' : 'modules/widget.js'
    'crypto' : 'modules/crypto.js'
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

define 'debug', ->
  debug = window.debug
  if CONFIG.pattern
    debug.enable CONFIG.pattern
  else
    debug.disable()
  debug


if CONFIG.jsDebug > 0
  filterModList = ['jquery', 'underscore', 'Backbone', 'moment', 'async', 'echarts']
  stats = (obj, level) ->
    funcs = _.functions obj
    _.each funcs, (func) ->
      start = new Date() - 0
      tmp = _.wrap obj[func], ->
        args = _.toArray arguments
        originalFunc = args.shift()
        msg = "call #{func}"
        msg += ", args:#{args}" if level > 1
        originalFunc.apply @, args
        console.log "#{msg} use:#{new Date() - start}ms"
      obj[func] = tmp
      return

  seajs.on 'exec', (mod) ->
    id = mod.id
    return if ~_.indexOf filterModList, id
    stats mod.exports, CONFIG.jsDebug 
