# nodeMailer = require 'nodemailer'

# smtpOptions = 
#   transport : 'SMTP'
#   host : 'smtp.163.com'
#   secureConnection : true
#   port : 465
#   maxConnections : 1
#   requiresAuth : true
#   domains : ['163.com']
#   auth : 
#     user : 'nodeapp@163.com'
#     pass : 'cuttlefish'

# transport = nodeMailer.createTransport 'SMTP', smtpOptions

# sendMailOptions =
#   form : 'nodeapp@163.com'
#   to : 'vicansocanbico@gmail.com'
#   subject : 'APP ERROR'
#   text : '出错了！'
# transport.sendMail sendMailOptions, (err, res) ->
#   console.dir err
#   console.dir res 

