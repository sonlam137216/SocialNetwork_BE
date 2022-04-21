const mongoose = require('mongoose');
const Comment = require('../model/commentModel');
const Post = require('../model/postModel');

const commentCtrl = {
  getComments: async (req, res) => {
    try {
      const cmts = await Comment.find({postId: req.params.postId, parent: 'x'})
      .populate({
        path: 'reply', 
        populate: [{
          path: 'reply', 
          populate: [{
            path: 'reply', 
            populate: [{path: 'reply'}, {path: 'user'}
            ]}, 
            {path: 'user'}
          ]}, 
          {path: 'user'}]
      })
      .populate({path: 'user'})
      // .sort({'createdAt':-1})
      ;

      res.json({ success: true, cmts });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  createComment: async (req, res) => {
    const { content } = req.body;
    // console.log(req);
    if (!content)
      return res
        .status(400)
        .json({ success: false, message: 'content is required' });

    try {
      const userId = await Post.findOne({_id: mongoose.Types.ObjectId(req.params.postId)}, {_id: 0, user: 1});

      const newComment = new Comment({
        content,
        user: req.userId,
        postId: req.params.postId,
        postUserId: userId.user,
        // tag:
        likes: [],
        reply: [],
        parent: (req.params.commentId) ? null : 'x'
      });

      await newComment.save();

      if(req.params.commentId) {
        const newCommentId = await Comment.findOne(
          {user: req.userId, postId: req.params.postId, postUserId: userId.user, reply: [], content}, 
          {_id:1, content: 0, reply: 0, likes: 0, postId: 0, postUserId: 0, user: 0, tag: 0, __v: 0}
        ); 

        const updateReply = await Comment.findOneAndUpdate({ _id: .mongooseTypes.ObjectId(req.params.commentId)}, {$push: {reply: newCommentId._id}});
      }

      res.json({ success: true, message: 'comment successfully!', newComment });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  updateComment: async (req, res) => {
    const { content } = req.body;

    //simple validation
    if (!content)
      return res
        .status(400)
        .json({ success: false, message: 'content is required' });

    try {
      console.log(req.body);
      console.log(req.params.commentId);
      const updated = await Comment.updateOne({_id: mongoose.Types.ObjectId(req.params.commentId)}, {$set: {content}});

      res.json({ success: true, message: 'update comment successfully!', updated });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const deleted = await Comment.deleteOne({_id: mongoose.Types.ObjectId(req.params.commentId)});

      const pop_cmts = await Comment.find({reply: mongoose.Types.ObjectId(req.params.commentId)}, (err, cmts) => {
        cmts.forEach((cmt) => {
          cmt.updateOne({$pull: {reply: mongoose.Types.ObjectId(req.params.commentId)}}, function(err) {
            if (err){
              console.log(err);
            }});
        });
      }).clone().catch(function(err){ 
        console.log(err);
      });
      res.json({ success: true, message: 'delete comment successfully!', deleted });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

//   ulComment: async (req, res) => {
//     try {
//       const like_cmt = await Comment.find({ _id: mongoose.Types.ObjectId(req.params.id), "likes.user": mongoose.Types.ObjectId(req.userId) });
//       if (like_cmt.length > 0)
//         {
//           const ul = await Comment.findOneAndRemove({_id: mongoose.Types.ObjectId(req.params.id)}); //?? delete and remove
//         }

//       const ul = await Comment.findOneAndUpdate(
//         { _id: mongoose.Types.ObjectId(req.params.id) },
//         { $push: { "likes.user": mongoose.Types.ObjectId(req.userId) } },
//         { new: true }
//       );

//       res.json({ message: 'React comment successfully' });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Internal server error!' });
//     }
//   },
};

module.exports = commentCtrl;
