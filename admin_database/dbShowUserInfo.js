var showUserInfo = new function () {
    this.showUserInfoByID = function (sqlparams, pool, callback) {
        pool.getConnection((err, conn) => {
            var sql = 'SELECT * FROM users where uid = ?'
            if (err) {
                console.log('[pool error] : ' + err.message)
            } else {
                conn.query(sql, sqlparams, (err, result) => {
                    if (err) {
                        console.log('[select error] : ' + err.message)
                        callback(null)
                    } else {
                        if (result.length) {
                            callback({
                                'uid': result[0].uid,
                                'username': result[0].username,
                                'email': result[0].email,
                                'regtime': result[0].regtime,
                                'lognum': result[0].lognum,
                                'logtime': result[0].logtime,
                                'role': result[0].role,
                                'emailchecktype': result[0].emailchecktype
                            })
                        } else {
                            callback({})
                        }
                    }
                    conn.release()
                })
            }
        })
    }

    this.showAllUserInfo = function (sqlparams, pool, callback) {
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('[pool error] : ' + err.message)
            } else {
                var sql = 'SELECT uid, username, email, regtime, lognum, logtime, role FROM users;'
                conn.query(sql, (err, result) => {
                    if (err) {
                        console.log('[select error] : ' + err.message)
                    }
                    callback(result)
                    conn.release()
                })
            }
        })
    }
}

module.exports = showUserInfo