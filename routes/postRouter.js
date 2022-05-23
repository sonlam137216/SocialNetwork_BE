const express = require('express')
const router = express.Router()
const postCtrl = require('../controller/postCtrl')
const verifyToken = require('../middleware/auth')

router.get('/', verifyToken, postCtrl.getPosts)
<<<<<<< HEAD
=======
router.get('/user/:id', verifyToken, postCtrl.getPostByUserId)
>>>>>>> 2a13eb4482791046c1d9813922dfd0436a893069
router.get('/:id', verifyToken, postCtrl.getPostById)
router.post('/', verifyToken, postCtrl.createPost)

//like and unlike
router.patch('/post/:id/like', verifyToken, postCtrl.likePost)
router.patch('/post/:id/unlike', verifyToken, postCtrl.unLikePost)

module.exports = router