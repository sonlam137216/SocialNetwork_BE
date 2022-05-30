const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/userCtrl");
const verifyToken = require("../middleware/auth");

router.post("/search", verifyToken, userCtrl.searchUser);
// router.get('/:id', verifyToken, userCtrl.getUser);
// router.get('/:id', verifyToken, userCtrl.getAllUserPosts);
// router.get('/contact', verifyToken, userCtrl.getContactUser);

// follow and unfollow
router.patch("/user/:id/follow", verifyToken, userCtrl.follow);
router.patch("/user/:id/unfollow", verifyToken, userCtrl.unfollow);
router.patch("/user/:id/remove-follow", verifyToken, userCtrl.removeFollow);

// suggestion users
router.get("/suggest", verifyToken);

// get array of users
router.post("/users", verifyToken, userCtrl.getUsers);

//update user
router.post("/update", verifyToken, userCtrl.updateUser),
  //get list followers
  // router.get('/list-followers', verifyToken, userCtrl.getListFollowers)
  // get list followings
  router.get("/list-followings", verifyToken, userCtrl.getListFollowings);

// get user info
router.get("/:id", verifyToken, userCtrl.getUserInfo);

router.get("/users/getAllUsers", verifyToken, userCtrl.getAllUsers);

router.get("/chat/contact", verifyToken, userCtrl.getContactUser);

router.post("/change-password", verifyToken, userCtrl.changePassword);
module.exports = router;
