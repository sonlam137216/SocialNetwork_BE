const express = require('express')
const router = express.Router()
const commentCtrl = require('../controller/commentCtrl')
const verifyToken = require('../middleware/auth')

router.get('/:postId', verifyToken, commentCtrl.getComments)
router.post('/:postId/:commentId?', verifyToken, commentCtrl.createComment)
router.put('/:commentId', verifyToken, commentCtrl.updateComment)
router.delete('/:commentId', verifyToken, commentCtrl.deleteComment)

router.put('/ul/:commentId', verifyToken, commentCtrl.ulComment) // like+unlike

module.exports = router