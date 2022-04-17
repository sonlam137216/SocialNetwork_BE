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
        
        
        const following = user.following;

        const relateUsers = []

        const relates = await following.map( async (item) => {
          const relateUser = await User.find({ _id: item})
          return relateUser;
        });
        console.log(relates)
                
        res.json({success: true, message: "get relate user success", relates})
    } catch (e) {
        console.log(`api, ${e}`);
        res.status(500).json({ error: e });
    }
  },

};

module.exports = homeCtrl;
