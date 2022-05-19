const Post = require('../model/postModel');
const Comment = require('../model/commentModel');

const postCtrl = {
  getPosts: async (req, res) => {
    try {
      const listPost = await Post.find({ user: req.userId }).populate('user');

      const posts = listPost.map(async (post, index) => {
        const response = await Comment.find({ postId: post._id });
        return { ...post, totalComment: response.length };
      });

      res.json({ success: true, message: 'get all post success', posts, listPost });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  createPost: async (req, res) => {
    const { content } = req.body;

    //simple validation
    if (!content)
      return res
        .status(400)
        .json({ success: false, message: 'content is required' });

    try {
      const newPost = new Post({
        content,
        user: req.userId,
      });

      await newPost.save();

      res.json({ success: true, message: 'happy learning!', newPost });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Interal server error' });
    }
  },
  likePost: async (req, res) => {
    const {postId} = req.body
    try {
      const post = await Post.find( {$and: [{ _id: postId }, { like: req.userId }]});
      if (post.length > 0)
        return res.status(400).json({ message: 'You liked this post!' });

      const likedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: req.userId } },
        { new: true }
      );

      if (!like)
        return res.status(400).json({ message: 'This post does not exist!' });

      res.json({ message: 'Liked post', likedPost });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error!' });
    }
  },

  unLikePost: async (req, res) => {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: req.userId } },
        { new: true }
      );

      if (!post)
        return res.status(400).json({ message: 'This post does not exist!' });

      res.json({ message: 'Unlike post!' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error!' });
    }
  },
};

module.exports = postCtrl;
