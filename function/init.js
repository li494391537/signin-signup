var mysql = require('mysql')
var crypto = require('crypto')

var mysql = mysql.createConnection({
    host: 'localhost',
    user: process.argv[2],
    password: process.argv[3],
    database: 'test',
    port: '3306'
});

(() => {
    mysql.connect()
    var sql = 'DROP TABLE users'
    mysql.query(sql, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log('drop table sussess')
        }
        var sql = 'CREATE TABLE users(uid int primary key auto_increment,username varchar(40) unique not null,password varchar(64) not null,salt1 varchar(64) not null,salt2 varchar(64) not null,email varchar(40) unique not null,regtime varchar(40) not null,lognum tinyint,logtime bigint,emailcheck varchar(128),emailchecktime bigint,emailchecktype tinyint not null default 0,role tinyint not null default 0);'
        mysql.query(sql, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log('create table sussess')
            }
            var salt1 = crypto.randomBytes(32).toString('hex')
            var salt2 = crypto.randomBytes(32).toString('hex')
            var content = 'admin123'
            var sha256 = crypto.createHash('sha256')
            sha256.update(salt1)
            sha256.update(content)
            var d = sha256.digest('hex')
            var content = d
            sha256 = crypto.createHash('sha256')
            sha256.update(salt2)
            sha256.update(content)
            var dd = sha256.digest('hex')
            var regtime = (() => {
                var date = new Date()
                var time = date.getTime()
                date = new Date(time)
                time = parseInt(time / 1000)
                return date.getFullYear() +
                    '-' +
                    (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +
                    '-' +
                    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
                    ' ' +
                    (parseInt(time / 60 / 60 % 24) < 10 ? '0' + parseInt(time / 60 / 60 % 24) : parseInt(time / 60 / 60 % 24)) +
                    ':' +
                    (parseInt(time / 60 % 60) < 10 ? '0' + parseInt(time / 60 % 60) : parseInt(time / 60 % 60)) +
                    ':' +
                    (parseInt(time % 60) < 10 ? '0' + parseInt(time % 60) : parseInt(time % 60))
            })()
            var sqlparams = ['admin', dd, salt1, salt2, 'admin@test.local', regtime, 63]
            var sql = 'INSERT INTO users (username, password, salt1, salt2, email, regtime, role) VALUES (?, ?, ?, ?, ?, ?, ?);'
            mysql.query(sql, sqlparams, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('insert "admin" sussess')
                    test(1, mysql)
                }
            })
        })
    })
})();

function test(count, mysql) {
    var salt1 = crypto.randomBytes(32).toString('hex')
    var salt2 = crypto.randomBytes(32).toString('hex')
    var content = 'password' + count
    var sha256 = crypto.createHash('sha256')
    sha256.update(salt1)
    sha256.update(content)
    var d = sha256.digest('hex')
    var content = d
    sha256 = crypto.createHash('sha256')
    sha256.update(salt2)
    sha256.update(content)
    var dd = sha256.digest('hex')
    var regtime = (() => {
        var date = new Date()
        var time = date.getTime()
        date = new Date(time)
        time = parseInt(time / 1000)
        return date.getFullYear() +
            '-' +
            (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +
            '-' +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
            ' ' +
            (parseInt(time / 60 / 60 % 24) < 10 ? '0' + parseInt(time / 60 / 60 % 24) : parseInt(time / 60 / 60 % 24)) +
            ':' +
            (parseInt(time / 60 % 60) < 10 ? '0' + parseInt(time / 60 % 60) : parseInt(time / 60 % 60)) +
            ':' +
            (parseInt(time % 60) < 10 ? '0' + parseInt(time % 60) : parseInt(time % 60))
    })()
    var sqlparams = ['test' + count, dd, salt1, salt2, 'test' + count + '@test.lan', regtime, (count & 31)]
    var sql = 'INSERT INTO users (username, password, salt1, salt2, email, regtime, role) VALUES (?, ?, ?, ?, ?, ?, ?);'
    mysql.query(sql, sqlparams, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Insert user ' + '"' + sqlparams[0] + '"' + ' sussess')
        }
        count++;
        if (count <= 100) {
            test(count, mysql)
        } else {
            mysql.end()
        }
    })
}