const express = require('express')
const router = express.Router()
const authCtrl = require('../controller/authCtrl')

router.post('/login', authCtrl.login)
router.post('/register', authCtrl.register)
router.post('/token', authCtrl.token)

module.exports = router