module.exports = function existsUser(sqlparams, pool, callback) {
    if (sqlparams.length == 1) {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('[pool error] : ' + err.message)
                callback(null)
            } else {
                var sql = 'SELECT * FROM users WHERE uid = ?'
                connection.query(sql, sqlparams, (err, result) => {
                    if (err) {
                        console.log('[select error] : ' + err.message)
                        callback(null)
                    } else {
                        callback(result.length)
                    }
                    connection.release()
                })
            }
        })
    } else {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('[pool error] : ' + err.message)
                callback(null)
            } else {
                var sql = 'SELECT COUNT(*) FROM users WHERE username = ? or email = ?';
                connection.query(sql, sqlparams, (err, result) => {
                    if (err) {
                        console.log('[select error] : ' + err.message)
                        callback(null)
                    } else {
                        callback(result)
                    }
                    connection.release()
                })
            }
        })
    }
}