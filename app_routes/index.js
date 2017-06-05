var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
    if (req.session.isLogin) {
        res.render('index', {
            isLogin: true,
            userInfo: {
                username: req.session.userName
            }
        })
    } else {
        req.session.isLogin = false;
        res.render('index', {
            isLogin: false
        })
    }
})

module.exports = router