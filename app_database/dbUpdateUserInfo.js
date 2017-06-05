var crypto = require('crypto')
var uid = require('uid-safe')

var updateUserInfo = new function () {
    this.updatePassword = function (sqlparams, pool, callback) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('[pool error] : ' + err.message)
                callback(null)
            } else {
                var sql = 'UPDATE users SET password=?, salt1=?, salt2=? WHERE uid=?'

                var salt1 = crypto.randomBytes(32)
                salt1 = salt1.toString('hex')
                var content = sqlparams[0]
                var sha256 = crypto.createHash('sha256')
                sha256.update(salt1)
                sha256.update(content)
                var d = sha256.digest('hex')

                var salt2 = crypto.randomBytes(32)
                salt2 = salt2.toString('hex')
                var content = d
                sha256 = crypto.createHash('sha256')
                sha256.update(salt2)
                sha256.update(content)
                var dd = sha256.digest('hex')

                sqlparams = [dd, salt1, salt2, sqlparams[1]]

                conn.query(sql, sqlparams, (err, result) => {
                    conn.release()
                    if (err) {
                        console.log('[select error] : ' + err.message)
                        callback(null)
                    } else {
                        callback(result)
                    }
                })
            }
        })
    }

    this.updateEmail = function (sqlparams, pool, callback) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('[pool error] : ' + err.message)
                callback(null)
            } else {
                var sql = 'UPDATE users SET email=?, emailcheck=?, emailchecktime=?, emailchecktype=? WHERE uid=?'
                conn.query(sql, [sqlparams[0], crypto.randomBytes(64).toString('hex'), (new Date()).getTime(), 2, sqlparams[1]], (err, result) => {
                    conn.release()
                    if (err) {
                        console.log('[select error] : ' + err.message)
                        callback(null)
                    } else {
                        callback([sqlparams[1]])
                    }
                })
            }
        })
    }

    this.updateLogInfo = function (sqlparams, pool, callback) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('[pool error] : ' + err.message)
                callback(null)
            } else {
                var sql = 'UPDATE users SET lognum=?, logtime=? WHERE uid=?'
                conn.query(sql, sqlparams, (err, result) => {
                    conn.release()
                    if (err) {
                        console.log('[select error] : ' + err.message)
                        callback(null)
                    } else {
                        callback(result)
                    }
                })
            }
        })
    }

    this.updateUserStat = function (sqlparams, pool, callback) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('[pool error] : ' + err.message)
                callback(null)
            } else {
                var sql = 'UPDATE users SET emailchecktype=?, emailcheck=? WHERE emailcheck=?'
                conn.query(sql, [sqlparams[0], null, sqlparams[1]], (err, result) => {
                    conn.release()
                    if (err) {
                        console.log('[select error] : ' + err.message)
                        callback(null)
                    } else {
                        callback(result)
                    }
                })
            }
        })
    }
}
module.exports = updateUserInfo