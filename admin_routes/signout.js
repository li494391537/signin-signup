var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
    req.session.isLogin = false
    res.redirect('/')
})

module.exports = router