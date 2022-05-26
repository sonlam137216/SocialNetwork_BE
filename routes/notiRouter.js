const express = require("express");
const router = express.Router();
const notiCtrl = require("../controller/notiCtrl");
const verifyToken = require("../middleware/auth");

router.get("/getNoti", verifyToken, notiCtrl.getNotiByUserId);
router.post("/createNoti", verifyToken, notiCtrl.createNoti);
router.patch("/seenNoti", verifyToken, notiCtrl.seenNotification);
router.patch("/seenAllNoti", verifyToken, notiCtrl.seenAllNotification);

module.exports = router;
