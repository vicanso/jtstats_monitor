seajs.config {
  base : CONFIG.staticUrlPrefix
  alias : 
    'jtLazyLoad' : 'components/jtlazy_load/dest/jtlazy_load.js'
    'stats' : 'modules/stats.js'
    'chart' : 'modules/chart.js'
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
