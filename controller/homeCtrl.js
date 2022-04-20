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
            //  Lấy user hiện tại
            const currentUser = await User.findOne({
                _id: req.userId,
            });
            // Lấy user mà user hiện tại đang follow

            const usersWhomCurrentUserFollow = await User.find({
                _id: { $in: currentUser.following },
            });

            const resolveToFollowingArray = usersWhomCurrentUserFollow
                .map((user) => {
                    return $user.following;
                })
                .join(',')
                .split(',');
            const finalUsers = await User.find({
                _id: { $in: resolveToFollowingArray },
            });
            const finalOfFinalUsers = finalUsers.filter((final) => !final.following.includes(currentUser._id));

            res.json({ success: true, finalOfFinalUsers });
        } catch (e) {
            console.log(api, $e);
            res.status(500).json({ error: e });
        }
    },
};

module.exports = homeCtrl;
