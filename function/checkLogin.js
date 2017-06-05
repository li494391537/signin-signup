var banIPHandle = require('./banIPHandle')

module.exports = function checkLogin(req, res, next) {
    if (req.method === 'POST') {
        if (req.session.isLogin) {
            next('route')
        } else {
            req.session.isLogin = false
            banIPHandle.updateBanIP(req.app.banIP, req.ip.toString())
            res.redirect('/signin');
        }
    } else if (req.method === 'GET') {
        if (req.session.isLogin) {
            next('route')
        } else {
            req.session.isLogin = false
            res.redirect('/signin');
        }
    } else {
        next('route')
    }
}