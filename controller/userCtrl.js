const { ObjectId, CURSOR_FLAGS } = require("mongodb");
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const Post = require("../model/postModel");

const userCtrl = {
  getUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ _id: userId });
      //.populate('followers following', '-password')
      console.log(user);

      if (!user)
        res.status(400).json({ success: false, message: "Not found User" });
      res.json({ success: true, message: "Get user success", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Interal server error" });
    }
  },
  follow: async (req, res) => {
    try {
      const user = await User.find({
        _id: req.userId,
        following: req.params.id,
      }).exec();
      if (user.length != 0)
        return res
          .status(400)
          .json({ success: true, message: "You have followed this user!" });

      const followingUser = await User.findByIdAndUpdate(
        { _id: req.userId },
        { $push: { following: req.params.id } },
        { new: true }
      );

      const followerUser = await User.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { followers: req.userId } },
        { new: true }
      );

      res.json({ success: true, message: "update follow user", followingUser });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  unfollow: async (req, res) => {
    try {
      const unfollowUser = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      ).populate("followers following");

      const unfollowerUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.userId },
        },
        { new: true }
      );

      if (!unfollowUser || !unfollowerUser) {
        res.status(400).json("Does not update user");
      }

      // if (unfollowUser.length == 0)
      //   res
      //     .status(400)
      //     .json({ success: false, message: 'Not found unfollow User' });

      res.json({
        success: true,
        message: "unfollow User",
        unfollowUser,
        unfollowerUser,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  searchUser: async (req, res) => {
    const { search } = req.body;

    //simple validation
    if (!search)
      return res
        .status(400)
        .json({ success: false, message: "username is required" });

    //simple validation
    if (!search)
      return res
        .status(400)
        .json({ success: false, message: "username is required" });

    try {
      const users = await User.find({
        email: { $regex: search },
      });

      res.json({ success: true, users });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Interal server error" });
    }
  },
  getUsers: async (req, res) => {
    let users = [];
    try {
      for (var i = 0; i < req.body.length; i++) {
        var uid = req.body[i];
        const user = await User.find({ _id: uid });
        users.push(user);
      }
      res.json({ success: true, users });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  getContactUser: async (req, res) => {
    try {
      const contactUsers = (
        await User.findOne({
          _id: req.userId,
        }).populate({ path: "following" })
      ).following;

      res.json({ success: true, contactUsers });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Interal server error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { name, mobile, gender, avatar } = req.body;
      if (!name)
        return res.status(400).json({ msg: "Please add your full name." });

      const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          name,
          mobile,
          gender,
          avatar,
        },
        {
          new: true,
        }
      );

      res.json({
        success: true,
        message: "Updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  },

  getUserInfo: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate(
        "followers following"
      );
      if (!user)
        res.status(400).json({ success: false, message: "Not found user!" });

      res.json({
        success: true,
        message: "get user info success",
        userInfo: user,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  },
  getListFollowings: async (req, res) => {},

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      const usersngon = users.map((user) => {
        const { password, ...others } = user._doc;
        return others;
      });
      console.log(usersngon);
      res
        .status(200)
        .json({ success: true, message: "OK!!", listUser: usersngon });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  },
  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;
    try {
      const user = await User.findById(userId);
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Not found user!" });

      // compare password
      const passwordValid = await bcrypt.compare(oldPassword, user.password);
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      if (!passwordValid)
        return res
          .status(400)
          .json({ success: false, message: "Password incorrect!" });

      const updatedCondition = { _id: userId };

      const updatedUser = await User.findOneAndUpdate(
        updatedCondition,
        { password: hashedPassword },
        { new: true }
      );

      res.json({
        success: true,
        message: "Change password success",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  },
};

module.exports = userCtrl;
