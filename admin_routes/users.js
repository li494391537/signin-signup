var existsUser = require('../admin_database/dbExistsUser')
var showUserInfo = require('../admin_database/dbShowUserInfo')
var updateUserInfo = require('../admin_database/dbUpdateUserInfo')
var tools = require('../function/tools')
var checkLogin = require('../function/checkLogin')
var express = require('express')
var router = express.Router()

router.use(checkLogin);

router.get('/', (req, res, next) => {
    showUserInfo.showAllUserInfo([], req.app.pool, (result) => {
        res.render('users', {
            'isLogin': true,
            'userInfo': {
                'username': req.session.userName
            },
            'userinfos': result
        })
    })
})

router.get('/:uid', (req, res, next) => {
    existsUser([req.params.uid], req.app.pool, (result) => {
        if (result) {
            showUserInfo.showUserInfoByID(req.params.uid, req.app.pool, (result) => {
                res.render('updateUserInfo', {
                    'isLogin': req.session.isLogin,
                    'userInfo': {
                        'username': req.session.userName,
                    },
                    'editInfo': {
                        'uid': result.uid,
                        'username': result.username,
                        'email': result.email,
                        'regtime': result.regtime,
                        'role': result.role,
                        'lognum': result.lognum,
                        'logtime': result.logtime,
                        'emailchecktype': result.emailchecktype
                    },
                    'message' : req.query.message
                })
            })
        } else {
            next()
        }
    })
})

router.post('/:uid', (req, res, next) => {
    existsUser(req.params.uid, req.app.pool, (result) => {
        if (result) {
            if (tools.checkEmail(req.body.email) && (req.body.role & 32)) {
                var email = req.body.email
                var role = req.body.role
                var sqlparams = [email, role, req.params.uid]
                updateUserInfo(sqlparams, req.app.pool, (result) => {
                    res.redirect('/users/' + req.params.uid)
                })
            } else {
                res.redirect('/users/' + req.params.uid)
            }

        } else {
            res.redirect('/users')
        }
    })
})

router.post('/:uid/password', (req, res, next) => {
    existsUser(req.params.uid, req.app.pool, (result) => {
        if (result) {
            if(tools.checkPassWord())
            {
                var password = req.body.newpassword
                var sqlparams = [password, req.params.uid]
                updateUserInfo.updateUserPassword(sqlparams, req.app.pool, (result) => {
                    res.redirect('/users/' + req.params.uid + '?message=修改成功')
                })
            } else {
                res.redirect('/users/' + req.params.req + '?message=修改失败')
            }
        }
        else { 
            res.redirect('/users/')
        }
    })
})

router.get('/:uid/deban', (req, res, next) => {
    existsUser(req.params.uid, req.app.pool, (result) => {
        if (result) {
                var sqlparams = [0, req.params.uid]
                updateUserInfo.updateUserBanStat(sqlparams, req.app.pool, (result) => {
                    res.redirect('/users/' + req.params.uid + '?message=解封成功')
                })
        }
        else { 
            res.redirect('/users/')
        }
    })
})

router.get('/:uid/enban', (req, res, next) => {
    existsUser(req.params.uid, req.app.pool, (result) => {
        if (result) {
                var sqlparams = [1, req.params.uid]
                updateUserInfo.updateUserBanStat(sqlparams, req.app.pool, (result) => {
                    res.redirect('/users/' + req.params.uid + '?message=封印成功')
                })
        }
        else { 
            res.redirect('/users/')
        }
    })
})

module.exports = router