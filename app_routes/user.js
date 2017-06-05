var existsUsers = require('../app_database/dbExistsUser')
var showUserInfo = require('../app_database/dbShowUserInfo')
var updateUserInfo = require('../app_database/dbUpdateUserInfo')
var signin = require('../app_database/dbSignin')
var tools = require('../function/tools')
var checkLogin = require('../function/checkLogin')
var banIPHandle = require('../function/banIPHandle')

var express = require('express')
var router = express.Router()

// 检查是否登陆
router.use(checkLogin)

router.get('/', (req, res, next) => {
    showUserInfo([req.session.uid], req.app.pool, (result) => {
        res.render('user', {
            title: req.session.userName + '的个人信息',
            isLogin: req.session.isLogin,
            userInfo: {
                username: result.username,
                email: result.email,
                regtime: result.regtime,
                role: result.role,
                emailchecktype: result.emailchecktype,
                message: req.params.message
            }
        })
    })
})

router.post('/password', (req, res, next) => {
    //使用输入的密码尝试登陆
    signin([req.session.userName, req.body.oldpassword], req.app.pool, (result) => {
        //登陆成功则更改密码
        if (result.isLogin) {
            updateUserInfo.updatePassword([req.body.newpassword, req.session.uid], req.app.pool, (result) => {
                res.redirect('/user?message=1')
            })
        } else {
            //登陆失败记录IP
            banIPHandle.updateBanIP(req.app.banIP, req.ip.toString())
            res.redirect('/user?message=2') //原密码错误
        }
    })
})

router.post('/email', (req, res, next) => {
    if (tools.checkEmail(req.body.newemail)) {
        updateUserInfo.updateEmail([req.body.newemail, req.session.uid], req.app.pool, (result) => {
            if (result != null) {
                console.log(result)
            }
            res.redirect('/user?message=3') //修改Email成功
        })
    } else {
        res.redirect('/user?message=4') //邮箱名不符合规则
    }
})

module.exports = router