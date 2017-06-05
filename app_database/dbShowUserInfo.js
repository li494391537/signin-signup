module.exports = function (sqlparams, pool, callback) {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log('[pool error] : ' + err.message)
            callback(null)
        } else {
            var sql = 'SELECT * FROM users where uid = ?'
            conn.query(sql, sqlparams, (err, result) => {
                conn.release()
                if (err) {
                    console.log('[select error] : ' + err.message)
                    callback(null)
                } else {
                    if (result) {
                        callback({
                            uid: result[0].uid,
                            username: result[0].username,
                            email: result[0].email,
                            regtime: result[0].regtime,
                            emailchecktype: result[0].emailchecktype,
                            role: result[0].role
                        })
                    }
                }
            })
        }
    })
}