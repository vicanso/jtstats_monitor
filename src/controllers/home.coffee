mongodb = require '../helpers/mongodb'
module.exports = (req, res, cbf) ->
  cbf null, {
    viewData :
      globalVariable : 
        name : 'tree'
  }