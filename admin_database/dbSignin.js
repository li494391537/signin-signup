var updateUserInfo = require('./dbUpdateUserInfo')
var crypto = require('crypto')

module.exports = function signin(sqlparams, pool, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('[pool error] : ' + err.message)
            callback(null)
        } else {
            var sql = 'SELECT * FROM users where username = ?'
            connection.query(sql, sqlparams, (err, result) => {
                if (err) {
                    console.log('[select error] : ' + err.message)
                    callback(null)
                } else {
                    if (result.length) {
                        //管理员账号为了安全性无法登陆主页面，只能登陆管理系统
                        if (!(result[0].role & 32)) {
                            callback({
                                isLogin: false
                            })
                        } else {
                            //判断是否被冻结且处于冻结期内
                            if (result[0].lognum > 4 &&
                                (new Date()).getTime() - result[0].logtime < 1000 * 60 * 60 * 12) {
                                callback({
                                    isLogin: false
                                })
                            } else {
                                var dd = result[0].password
                                var salt1 = result[0].salt1
                                var salt2 = result[0].salt2

                                var sha256 = crypto.createHash('sha256')
                                sha256.update(salt1)
                                sha256.update(sqlparams[1])
                                var d1 = sha256.digest('hex')

                                sha256 = crypto.createHash('sha256')
                                sha256.update(salt2)
                                sha256.update(d1)
                                var d2 = sha256.digest('hex')

                                if (dd == d2) {
                                    callback({
                                        isLogin: true,
                                        uid: result[0].uid,
                                        username: result[0].username,
                                        role: result[0].role
                                    })
                                } else {
                                    //密码错误，记录进数据库
                                    if ((new Date()).getTime() - result[0].logtime < 1000 * 60 * 5) {
                                        var lognum = result[0].lognum + 1
                                        var logtime = (new Date()).getTime()
                                        updateUserInfo.updateLogInfo([lognum, logtime, result[0].uid], pool, (result) => {})
                                    } else {
                                        var lognum = 1
                                        var logtime = (new Date()).getTime()
                                        updateUserInfo.updateLogInfo([lognum, logtime, result[0].uid], pool, (result) => {})
                                    }
                                    callback({
                                        isLogin: false
                                    })
                                }
                            }
                        }
                    } else {
                        //用户名错误
                        callback(null)
                    }
                }
                connection.release()
            })
        }
    })
}