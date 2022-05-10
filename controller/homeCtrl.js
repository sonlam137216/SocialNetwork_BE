const Post = require('../model/postModel');
const User = require('../model/userModel');

const homeCtrl = {
    getHomePosts: async (req, res) => {
        try {
            const user = await User.findOne({
                _id: req.userId,
            });
            const posts = await Post.find({
                user: user.following,
            })
                .populate({ path: 'user' })
                .sort({ createdAt: -1 });
            if (!posts) {
                res.status(404).json({ error: 'not found' });
                return;
            }

            res.json({ success: true, posts });
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    },

    getRelateUser: async (req, res) => {
        try {
            let relateUserId = []
            //  Lấy user hiện tại
            const currentUser = await User.findOne({
                _id: req.userId,
            }).populate({path: 'following'});

            currentUser.following.forEach(user => {
                relateUserId = relateUserId.concat(user.following)
            });

            const relateUser = await User.find({
                $and: [
                    {_id: relateUserId},
                    {_id: {$ne: currentUser._id}},
                    {followers: {$ne: currentUser._id}}
                ]
            })
            
            res.json({ success: true, relateUser });
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    },
};

module.exports = homeCtrl;
