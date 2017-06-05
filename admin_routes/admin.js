var showUserInfo = require('../admin_database/dbShowUserInfo')
var express = require('express')
var checkLogin = require('../function/checkLogin') 

var router = express.Router()

router.use(checkLogin)

router.get('/', (req, res, next) => {
    showUserInfo.showUserInfoByID([req.session.uid], req.app.pool, (result) => {
        res.render('admin', {
            'isLogin': req.session.isLogin,
            'userInfo': {
                'username': result.username,
                'email': result.email,
                'regtime': result.regtime,
                'role': result.role,
            }
        })
    })

})
module.exports = router