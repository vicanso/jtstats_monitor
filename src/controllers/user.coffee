mongodb = require '../helpers/mongodb'
config = require '../config'
async = require 'async'
url = require 'url'
moment = require 'moment'
_ = require 'underscore'
crypto = require 'crypto'
User = mongodb.model 'stats_user'
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
  data = req.body
  switch method
    when 'GET' then getUserInfo req, cbf
    when 'POST', 'PUT'
      if data.type == 'register'
        createUser req, cbf
      else
        modifyUser req, cbf
    when 'DELETE'
      user = 
        anonymous : true
        hash : getHashKey()
        ip : req.ip
      req.session.user = user
      cbf null, pickUserInfo user

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
  cbf null, pickUserInfo user

pickUserInfo = (data) ->
  _.pick data, ['anonymous', 'name', 'hash', 'id']

getInfo = (req, data) ->
  user =
    anonymous : false
    name : data.name
    # id : data.name
    ip : req.ip
modifyUser = (req, cbf) ->
  data = req.body
  hash = req.session?.user?.hash
  if !hash
    cbf new Error 'the hash is null'
  else
    async.waterfall [
      (cbf) ->
        User.findOne {name : data.name}, cbf
      (doc, cbf) ->
        if !doc
          cbf new Error 'the user is not exists'
          return
        shasum = crypto.createHash 'sha1'
        shasum.update "#{doc.pwd}_#{hash}"
        if data.pwd == shasum.digest 'hex'
          req.session.user = getInfo req, data
          cbf null, {
            message : 'success'
          }
        else
          cbf new Error 'the password is wrong'
    ], cbf

createUser = (req, cbf) ->
  data = req.body
  async.waterfall [
    (cbf) ->
      User.findOne {name : data.name}, cbf
    (doc, cbf) ->
      if doc
        cbf new Error 'the user is exists'
      else
        new User(data).save (err, res) ->
          if err
            cbf err
          else
            req.session.user = getInfo req, data
            cbf null, {
              message : 'success'
            }
  ], cbf
  



