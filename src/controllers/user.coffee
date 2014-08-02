mongodb = require '../helpers/mongodb'
config = require '../config'
async = require 'async'
url = require 'url'
moment = require 'moment'
_ = require 'underscore'
crypto = require 'crypto'
User = mongodb.model 'User'
logger = require('../helpers/logger') __filename


randomCodes = do ->
  arr = []
  for i in [48..122]
    arr.push String.fromCharCode i
  arr

getHashKey = ->
  arr = _.shuffle randomCodes
  arr.length = 10
  arr.join ''


# hash = crypto.createHmac 'sha1', 'test'
# hash.update 'vicanso'
# console.dir hash.digest 'hex'

module.exports = (req, res, cbf) ->
  method = req.method
  user = req.session
  switch method
    when 'GET' then getUserInfo req, cbf
    when 'POST' then createUser req, cbf

getUserInfo = (req, cbf) ->
  res.redirect 302, '/user?cache=false' if req.param('cache') != 'false'
  urlInfo = url.parse req.header 'referer'

  # PV lOG
  # console.dir urlInfo.path


  user = req.session?.user || {
    anonymous : true
    hash : getHashKey()
  }
  req.session.user = user
  cbf null, user


createUser = (req, cbf) ->
  data = req.body
  async.waterfall [
    (cbf) ->
      User.findOne {name : data.name}, cbf
    (doc, cbf) ->
      if doc
        cbf new Error 'the user is exists'
      else
        data.hash = getHashKey()
        new User(data).save (err, res) ->
          if err
            cbf err
          else
            cbf null, {
              message : 'success'
            }
  ], cbf
  



