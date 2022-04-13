const Comment = require('../model/commentModel');
const { param } = require('../routes/postRouter');
// param.postId, param.userId
const commentCtrl = {
  getComments: async (req, res) => {
    try {
      const cmts = await Comment.find({ postId: req.postId }).populate('postId');
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

    //simple validation
    if (!content)
      return res
        .status(400)
        .json({ success: false, message: 'content is required' });

    try {
      const newComment = new Comment({
        content,
        user: req.userId,
        // postId: ,
        // postUserId: ,
        // tag: 
      });

      await newComment.save();

      res.json({ success: true, message: 'happy learning!', newComment });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
};

module.exports = commentCtrl;
