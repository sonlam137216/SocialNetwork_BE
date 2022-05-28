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
router.patch('/unTymMessage', verifyToken, chatCtrl.unTymMessage);
router.patch('/changeAvatar/:id', verifyToken, chatCtrl.changeConversationAvatar);
router.delete('/deleteMessage/:messageId', verifyToken, chatCtrl.removeMessage);
router.patch('/seenAllMessages/:conId', verifyToken, chatCtrl.seenAllMessages);
router.patch('/seenMessage', verifyToken, chatCtrl.seenMessage);

module.exports = router;
