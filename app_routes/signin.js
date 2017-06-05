var signin = require('../app_database/dbSignin')
var existsUser = require('../app_database/dbExistsUser')
var tools = require('../function/tools')
var banIPHandle = require('../function/banIPHandle')

var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
    res.render('signin', {
        message: ''
    })
})

router.post('/', (req, res, next) => {
    var sqlparams = [req.body.username, req.body.password]
    if (tools.checkUserName(sqlparams[0]) && tools.checkPassWord(sqlparams[1])) {
        signin(sqlparams, req.app.pool, (result) => {
            if (result.isLogin != null && result.isLogin) {
                req.session.isLogin = true
                req.session.userName = result.username
                req.session.uid = result.uid
                req.session.role = result.role
                res.redirect('/')
            } else {
                banIPHandle.updateBanIP(req.app.banIP, req.ip.toString())
                req.session.isLogin = false
                res.render('signin', {
                    message: '用户名或密码错误！'
                })
            }
        })
    } else {
        res.render('signin', {
            message: '用户名或密码错误！'
        })
    }
})

module.exports = router