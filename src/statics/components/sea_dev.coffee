LOAD_FILES = []
seajs.on 'exec', (mod) ->
  LOAD_FILES.push mod.uri
  # LOAD_FILES.push files if files.length

seajs.on 'loadComplete', ->
  $.post '/seajs/files', {
    template : CONFIG.template
    files : LOAD_FILES
  }