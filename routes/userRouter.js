const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/userCtrl')
const verifyToken = require('../middleware/auth')

router.post('/search', verifyToken, userCtrl.searchUser)
router.get('/user/:id', verifyToken, )

// follow and unfollow
router.patch('/user/:id/follow', verifyToken, userCtrl.follow)
router.patch('/user/:id/unfollow', verifyToken, userCtrl.unfollow) 

// suggestion users
router.get('/suggest', verifyToken, )

module.exports = router

