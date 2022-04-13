const express = require('express')
const router = express.Router()
const homeCtrl = require('../controller/homeCtrl')
const verifyToken = require('../middleware/auth')

router.get('/post', verifyToken, homeCtrl.getHomePosts)
router.get('/relate', verifyToken, homeCtrl.getRelateUser)


module.exports = router