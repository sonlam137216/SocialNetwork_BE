const express = require('express')
const router = express.Router()
const chatCtrl = require('../controller/chatCtrl')
const verifyToken = require('../middleware/auth')

router.post('/createCon', verifyToken, chatCtrl.createConversation)
router.patch('/addUser/:conId', verifyToken, chatCtrl.addMember) 
router.get('/getCon', verifyToken, chatCtrl.getConversations)
router.get('/getMessageInCon', verifyToken, chatCtrl.getMessageInConversation)

module.exports = router