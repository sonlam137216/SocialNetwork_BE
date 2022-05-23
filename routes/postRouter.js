const express = require('express');
const router = express.Router();
const postCtrl = require('../controller/postCtrl');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, postCtrl.getPosts);
router.get('/:id', verifyToken, postCtrl.getPostById);
router.post('/createPost', verifyToken, postCtrl.createPost);

//like and unlike
router.patch('/post/:id/like', verifyToken, postCtrl.likePost);
router.patch('/post/:id/unlike', verifyToken, postCtrl.unLikePost);

module.exports = router;
