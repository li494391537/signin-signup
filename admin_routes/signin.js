var signin = require('../admin_database/dbSignin')
var existsUser = require('../admin_database/dbExistsUser')
var tools = require('../function/tools')
var banIPHandle = require('../function/banIPHandle')
var express = require('express')

var router = express.Router()

router.get('/', (req, res, next) => {
    res.render('signin', {
        'message': ''
    })
})

router.post('/', (req, res, next) => {
    var sqlparams = [req.body.username, req.body.password]
    if (tools.checkUserName(sqlparams[0]) && tools.checkPassWord(sqlparams[1])) {
        signin(sqlparams, req.app.pool, (result) => {
            if (result.isLogin != null && result.isLogin && (result.role & 32)) {
                req.session.isLogin = true
                req.session.userName = result.username
                req.session.uid = result.uid
                res.redirect('/')
            } else {
                banIPHandle.updateBanIP(res.app.banIP, req.ip.toString())
                req.session.isLogin = false
                res.render('signin', {
                    'message': '用户名或密码错误！'
                })
            }
        })
    } else {
        banIPHandle.updateBanIP(res.app.banIP, req.ip.toString())
        res.render('signin', {
            'message': '用户名或密码错误！'
        })
    }
})

module.exports = router