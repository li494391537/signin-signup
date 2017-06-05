var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mysql = require('mysql')
var fs = require('fs')
var fileStreamRotator = require('file-stream-rotator')
var crypto = require('crypto')

var banIPHandle = require('./function/banIPHandle')

var index = require('./app_routes/index')
var signin = require('./app_routes/signin')
var signup = require('./app_routes/signup')
var signout = require('./app_routes/signout')
var user = require('./app_routes/user')
var power = require('./app_routes/power')
var check = require('./app_routes/check')
var app = express()

// 设置模板引擎
app.engine('.html', require('ejs').__express)
app.set('views', path.join(__dirname, 'app_views'))
app.set('view engine', 'html')

app.banIP = new Array()

app.pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'toor',
    database: 'test',
    port: '3306'
})

app.use(banIPHandle.checkBanIP)

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// 设置日志记录中间件
var logDir = path.join(__dirname, 'app_logs')
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}
var accessLogStream = fileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDir, 'log-%DATE%.log'),
    frequency: 'daily',
    verbose: true
})
app.use(logger('dev'))
app.use(logger('common', {
    stream: accessLogStream
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(session({
    'secret': crypto.randomBytes(64).toString('hex'),
    'cookie': {
        maxAge: 24 * 60 * 60 * 1000
    },
    'resave': false,
    'saveUninitialized': false
}))

app.use(cookieParser())
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/', index)
app.use('/signin', signin)
app.use('/signup', signup)
app.use('/signout', signout)
app.use('/user', user)
app.use('/power', power)
app.use('/check', check)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app