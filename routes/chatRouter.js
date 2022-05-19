const express = require('express');
const router = express.Router();
const chatCtrl = require('../controller/chatCtrl');
const verifyToken = require('../middleware/auth');

router.post('/createCon', verifyToken, chatCtrl.createConversation);
router.patch('/addUser', verifyToken, chatCtrl.addMember);
router.patch('/removeUser', verifyToken, chatCtrl.removeMember);
router.get('/getCon', verifyToken, chatCtrl.getConversations);
router.post('/createMessage', verifyToken, chatCtrl.createMessage);
router.get('/:id', verifyToken, chatCtrl.getMessageInConversation);
router.post('/existCon', verifyToken, chatCtrl.getExistConversation);
router.get('/:id/members', verifyToken, chatCtrl.getMembersConversation);
router.delete('/removeCon', verifyToken, chatCtrl.removeConversation);
router.patch('/tymMessage', verifyToken, chatCtrl.tymMessage);
router.patch('/changeName/:id', verifyToken, chatCtrl.changeConversationName);

module.exports = router;
