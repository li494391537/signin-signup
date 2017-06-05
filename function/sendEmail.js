var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport')

//callback(err, msg)
module.exports = function sendMail(email, message, callback) {
    var mailOptions = {
        from: 'Signin Signup <signinsignup@126.com>',
        to: email,
        subject: 'Sign up验证邮件',
        text: '请点击链接',
        html: message
    }
    var mailTransport = nodemailer.createTransport(smtpTransport({
        host: 'smtp.126.com',
        port: '465',
        secure: 'true',
        auth: {
            user: 'signinsignup@126.com',
            pass: 'signin126'
        }
    }))
    mailTransport.sendMail(mailOptions, function (err, msg) {
        callback(err, msg)
    })
}