var banIPHandle = new function () {
    this.checkBanIP = function (req, res, next) {
        if (req.app.banIP[req.ip.toString()] &&
            req.app.banIP[req.ip.toString()].logNum > 4) {
            if ((new Date()).getDate() - req.app.banIP[req.ip.toString()].logTime < 1000 * 60 * 60 * 6) {
                var err = new Error('Forbidden')
                err.status = '403'
                next(err)
            }
        } else {
            next()
        }
    }
    
    this.updateBanIP = function (banList, ip) {
        if (banList[ip] &&
            (new Date()).getTime() - banList[ip].logTime < 1000 * 60 * 5) {
            banList[ip].logNum += 1
            banList[ip].logTime = (new Date()).getTime()
        } else {
            banList[ip] = {
                'logNum': 1,
                'logTime': (new Date()).getTime()
            }
        }
    }
}

module.exports = banIPHandle