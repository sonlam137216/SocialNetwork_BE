const Post = require('../model/postModel');
const User = require('../model/userModel');

const homeCtrl = {
  getHomePosts: async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.userId
        })
        const posts = await Post.find({
            user: user.following
        }).sort({createdAt: -1});
        if(!posts) {
            res.status(404).json({ error: "not found" })
            return;
        } 
                
        res.json({success: true, posts})
    } catch (e) {
        console.log(`api, ${e}`);
        res.status(500).json({ error: e });
    }
  },

  getRelateUser: async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.userId
        })
        //console.log(user.following)

        user.following.forEach(async function(element) {
          const relateUser = await User.find({
            $and: [{ followers: { $in: element } }, { followers: { $ne: user._id } }]
          })
        
      });
                
        res.json({success: true, relateUser})
    } catch (e) {
        console.log(`api, ${e}`);
        res.status(500).json({ error: e });
    }
  },

};

module.exports = homeCtrl;
