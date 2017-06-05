var checkLogin = require('../function/checkLogin')
var express = require('express')

var router = express.Router()

router.use(checkLogin)

router.use('/:id', (req, res, next) => {
    if (req.params.id == 1) {
        if (req.session.role & 1) {
            next('route')
        } else {
            res.render('error', {
                'message': 'Forbidden',
                'error': {
                    'stack': '',
                    'status': '403'
                }
            })
        }
    } else if (req.params.id == 2) {
        if (req.session.role & 2) {
            next('route')
        } else {
            res.render('error', {
                'message': 'Forbidden',
                'error': {
                    'stack': '',
                    'status': '403'
                }
            })
        }
    } else if (req.params.id == 3) {
        if (req.session.role & 4) {
            next('route')
        } else {
            res.render('error', {
                'message': 'Forbidden',
                'error': {
                    'stack': '',
                    'status': '403'
                }
            })
        }
    } else if (req.params.id == 4) {
        if (req.session.role & 8) {
            next('route')
        } else {
            res.render('error', {
                message: 'Forbidden',
                error: {
                    stack: '',
                    status: '403'
                }
            })
        }
    } else {
        res.render('error', {
            message: 'Not Found',
            error: {
                stack: '',
                status: '404'
            }
        })
    }
})

router.get('/:id', (req, res, next) => {
    res.render('power', {
        'power': req.params.id,
        userInfo: {
            username: req.session.username
        }
    })
})

module.exports = router