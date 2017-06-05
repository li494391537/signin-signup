var updateUserInfo = require('../app_database/dbUpdateUserInfo')
var express = require('express')

var router = express.Router()

router.get('/:checkCode', (req, res, next) => {
    if (req.params.checkCode.length == 128) {
        updateUserInfo.updateUserStat([0, req.params.checkCode], req.app.pool, (result) => {
            res.redirect('/signin')
        })
    }
})

module.exports = router