const express = require('express')
const router = express.Router()
const commentCtrl = require('../controller/commentCtrl')
const verifyToken = require('../middleware/auth')

router.get('/', verifyToken, commentCtrl.getComments)
// router.post('/', verifyToken, commentCtrl.createComment)

module.exports = router