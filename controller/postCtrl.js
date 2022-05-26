const Post = require("../model/postModel");
const Comment = require("../model/commentModel");

const postCtrl = {
  getPosts: async (req, res) => {
    try {
      const listPost = await Post.find({ user: req.userId }).populate("user");

      // const posts = listPost.map(async (post, index) => {
      //   console.log(post);
      //   const response = await Comment.find({ postId: post._id });
      //   console.log(response);
      //   return { ...post, totalComment: response.length };
      // });

      res.json({
        success: true,
        message: "get all post success",
        listPost,
        // posts,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  getPostByUserId: async (req, res) => {
    const userId = req.params.id;
    try {
      const listPost = await Post.find({ user: userId }).populate("user");

      const posts = [];

      listPost.forEach(async (post, index) => {
        const response = await Comment.find({ postId: post._id });
        await posts.push({ ...post._doc, total: response?.length });
      });

      const comment = await Comment.find({
        postId: "627950191d47d6ed235c0cc2",
      });

      res.json({
        success: true,
        message: "get post by id success",
        listPost,
        posts,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  getPostById: async (req, res) => {
    const postId = req.params.id;
    try {
      const post = await Post.find({ _id: postId }).populate("user");
      res.json({ message: "get post successfully", post });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error!" });
    }
  },

  createPost: async (req, res) => {
    const { content, images } = req.body;

    try {
      const newPost = new Post({
        content: content,
        images: images,
        user: req.userId,
      });

      await newPost.save();

      res.json({ success: true, message: "create post successfully", newPost });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Interal server error" });
    }
  },

  likePost: async (req, res) => {
    const { postId } = req.body;
    try {
      const likedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: req.userId } },
        { new: true }
      );

      if (!likedPost)
        return res.status(400).json({ message: "This post does not exist!" });

      res.json({ message: "Liked post", likedPost });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error!" });
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
        return res.status(400).json({ message: "This post does not exist!" });

      res.json({ message: "Unlike post!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error!" });
    }
  },
};

module.exports = postCtrl;
