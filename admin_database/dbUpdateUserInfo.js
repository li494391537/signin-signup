var crypto = require('crypto')

var updateUserInfo = new function () {
    this.updateUserInfo = function (sqlparams, pool, callback) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('[pool error] : ' + err.message)
                callback(null)
            } else {
                var sql = 'UPDATE users SET email=?, role=? WHERE uid=?;'
                conn.query(sql, sqlparams, (err, result) => {
                    if (err) {
                        console.log('[select error] : ' + err.message)
                        callback(null)
                    } else {
                        callback(result)
                    }
                    conn.release();
                })
            }
        })
    }

    this.updateUserPassword = function (sqlparams, pool, callback) {
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
                    if (err) {
                        console.log('[select error] : ' + err.message)
                    } else { }
                    callback(result)
                    conn.release()
                })
            }
        })
    }

    this.updateUserBanStat = function (sqlparams, pool, callback) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('[pool error] : ' + err.message);
                callback(null)
            } else {
                if (sqlparams[0] == 0) {
                    var sql = 'UPDATE users SET lognum=?, logtime=? WHERE uid=?'
                    sqlparams = [null, null, sqlparams[1]]
                    conn.query(sql, sqlparams, (err, result) => {
                        if (err) {
                            console.log('[select error] : ' + err.message)
                            callback(null)
                        } else { }
                        callback(result)
                        conn.release()
                    })
                } else {
                    var sql = 'UPDATE users SET lognum=?, logtime=? WHERE uid=?'
                    sqlparams = [5, (new Date()).getTime(), sqlparams[1]]
                    conn.query(sql, sqlparams, (err, result) => {
                        if (err) {
                            console.log('[select error] : ' + err.message)
                            callback(null)
                        } else { }
                        callback(result)
                        conn.release()
                    })
                }
            }
        })
    }
}

module.exports = updateUserInfo