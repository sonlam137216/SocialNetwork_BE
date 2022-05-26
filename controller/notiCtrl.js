const Noti = require("../model/notificationModel");

const notiCtrl = {
  createNoti: async (req, res) => {
    console.log(req.body);
    const { receiver, notiType, desId } = req.body;
    try {
      const newNoti = new Noti({
        sender: req.userId,
        receiver: receiver,
        notiType: notiType,
        desId: desId,
      });
      await newNoti.save();
      res.json({ success: true, message: "create noti successfully", newNoti });
    } catch {
      res.status(500).json({ success: false, message: "Interal server error" });
    }
  },

  getNotiByUserId: async (req, res) => {
    try {
      const notifications = await Noti.find({
        receiver: req.userId,
      })
        .populate("sender receiver")
        .sort({ createdAt: -1 });
      res.json({
        success: true,
        message: "create noti successfully",
        notifications,
      });
    } catch {
      res.status(500).json({ success: false, message: "Interal server error" });
    }
  },

  seenNotification: async (req, res) => {
    const { notiId } = req.body;
    try {
      const seenNoti = await Noti.findOneAndUpdate(
        { _id: notiId },
        {
          $set: { isSeen: true },
        },
        {
          new: true,
        }
      );
      res.json({ success: true, message: "seen noti successfully", seenNoti });
    } catch {
      res.status(500).json({ success: false, message: "Interal server error" });
    }
  },

  seenAllNotification: async (req, res) => {
    try {
      const seenNoti = await Noti.updateMany(
        { receiver: req.userId },
        {
          $set: { isSeen: true },
        },
        {
          new: true,
        }
      );
      res.json({ success: true, message: "seen noti successfully", seenNoti });
    } catch {
      res.status(500).json({ success: false, message: "Interal server error" });
    }
  },
};

module.exports = notiCtrl;
