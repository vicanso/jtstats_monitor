module.exports = (req, res, cbf) ->
  data = req.body
  data.userAgent = req.header 'user-agent'
  data.referer = GLOBAL.decodeURIComponent req.header 'referer'
  cbf null, {
    msg : 'success'
  }