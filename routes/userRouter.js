const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/userCtrl');
const verifyToken = require('../middleware/auth');

router.post('/search', verifyToken, userCtrl.searchUser);
// router.get('/:id', verifyToken, userCtrl.getAllUserPosts);
router.get('/contact', verifyToken, userCtrl.getContactUser);

// follow and unfollow
router.patch('/user/:id/follow', verifyToken, userCtrl.follow);
router.patch('/user/:id/unfollow', verifyToken, userCtrl.unfollow);

// suggestion users
router.get('/suggest', verifyToken);

// get array of users
router.get('/users', verifyToken, userCtrl.getUsers);

module.exports = router;

module.exports = router;
