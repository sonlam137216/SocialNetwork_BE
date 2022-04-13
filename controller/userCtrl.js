const User = require('../model/userModel');

const userCtrl = {
  follow: async (req, res) => {
    try {
      const user = await User.find({
        _id: req.userId,
        followers: req.params.id,
      });
      if (user)
        return res
          .status(400)
          .json({ success: true, message: 'You followed this user!' });

      const followUser = await User.findByIdAndUpdate(
        { _id: req.userId },
        { $push: { followers: req.params.id } },
        { new: true }
      );

      res.json({ success: true, message: 'update follow user', followUser });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },
  unfollow: async (req, res) => {
    try {
      const unfollowUser = User.findOneAndUpdate(
        { _id: req.userId },
        {
          $pull: { followers: req.params.id },
        },
        { new: true }
      );
      if (!unfollowUser)
        res
          .status(400)
          .json({ success: false, message: 'Not found unfollow User' });

      res.json({ success: true, message: 'unfollow User' });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },
};

module.exports = userCtrl;
