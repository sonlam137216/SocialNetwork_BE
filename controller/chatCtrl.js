const Post = require("../model/postModel");
const User = require("../model/userModel");
const Conversation = require("../model/conversationModel");
const Mess = require("../model/messageModel");

const chatCtrl = {
  createConversation: async (req, res) => {
    const { users } = req.body;

    const usersId = users.map((user) => user._id);

    usersId.push(req.userId);

    try {
      const newConversation = new Conversation({
        members: usersId
      });

      await newConversation.save();
      const conversation = await Conversation.findOne({
        _id: newConversation._id
      }).populate({ path: "members" });
      console.log(conversation);
      res.json({ success: true, message: "new conversation has created", conversation });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Interal server error" });
    }
  },

  getConversations: async (req, res) => {
    try {
      const conversation = await Conversation.find({
        members: req.userId
      })
        .sort({ updatedAt: -1 })
        .populate({ path: "members" });

      if (!conversation) {
        res.status(404).json({ error: "not found" });
        return;
      }

      res.json({ success: true, conversation });
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  },

  addMember: async (req, res) => {
    const { usersId, conversationId } = req.body;

    //simple validation
    if (!usersId) return res.status(400).json({ success: false, message: "0 user" });

    try {
      const conversation = await Conversation.find({
        _id: conversationId
      }).exec();

      const addUser = await Conversation.findOneAndUpdate(
        { _id: req.params.conId },
        { $push: { members: usersId } },
        { new: true }
      );
      const addedMembers = await User.findOne({
        _id: usersId
      });
      res.json({ success: true, message: "add user successful", addedMembers });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  removeMember: async (req, res) => {
    const { userId, conversationId } = req.body;

    try {
      const newConversation = await Conversation.findOneAndUpdate(
        { _id: conversationId },
        { $pull: { members: userId } },
        {
          new: true
        }
      );

      const removedMember = await User.findOne({
        _id: userId
      });
      res.json({ success: true, message: "remove user successful", removedMember, newConversation });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  createMessage: async (req, res) => {
    const { mess } = req.body;

    try {
      const newMessage = new Mess({
        sender: req.userId,
        conversationId: req.body.conversationId,
        content: {
          text: req.body.content,
          isImage: req.body.isImage
        }
      });

      await newMessage.save();
      const newBruh = await newMessage.populate({ path: "sender" });

      const conversation = await Conversation.findOneAndUpdate(
        { _id: newMessage.conversationId },
        {
          updatedAt: Date.now()
        }
      );

      res.status(201).json({ success: true, message: "save message", newMessage: newBruh });
      //socket.emit('sendMessage', newMessage)
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  getMessageInConversation: async (req, res) => {
    try {
      const messages = await Mess.find({
        conversationId: req.params.id
      }).populate({ path: "sender" });
      res.status(200).json({ success: true, message: "messages by conversation Id", messages });
      //socket.emit('sendMessage', newMessage)
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  getExistConversation: async (req, res) => {
    const { users } = req.body;
    const usersId = users.map((user) => user._id);
    try {
      const conversation = await Conversation.find({
        $and: [{ members: { $all: userId } }, { members: { $size: usersId.length } }]
      });

      res.status(200).json({ success: true, message: "existed conversation", conversation });
      //socket.emit('sendMessage', newMessage)
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  getMembersConversation: async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        _id: req.params.id
      }).populate({ path: "members" });
      res.status(200).json({ success: true, message: "existed conversation", members: conversation.members });
      //socket.emit('sendMessage', newMessage)
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  removeConversation: async (req, res) => {
    try {
      const { conversationId } = req.body;
      const conversation = await Conversation.findOneAndDelete({
        _id: conversationId
      });

      console.log(conversation);

      const messages = await Mess.deleteMany({
        conversationId: conversationId
      });

      res.json({ success: true, message: "existed conversation", conversation });
      //socket.emit('sendMessage', newMessage)
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  tymMessage: async (req, res) => {
    try {
      const userId = req.body.userId;
      const messageId = req.body.messageId;
      const newMessage = await Mess.findByIdAndUpdate(
        { _id: messageId },
        {
          $push: { tym: userId }
        },
        { new: true, upsert: true }
      ).populate({ path: "sender" });

      res.json({ success: true, message: "Tym successfully", newMessage });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  changeConversationName: async (req, res) => {
    const newName = req.body.newName;
    console.log(newName);
    try {
      const newConversation = await Conversation.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { name: newName } },
        { new: true }
      ).populate({ path: "members" });

      res.json({ success: true, message: "Change name successfully", newConversation });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
  unTymMessage: async (req, res) => {
    try {
      const userId = req.body.userId;
      const messageId = req.body.messageId;
      const newMessage = await Mess.findByIdAndUpdate(
        { _id: messageId },
        {
          $pull: { tym: userId }
        },
        { new: true, upsert: true }
      ).populate({ path: "sender" });

      res.json({ success: true, message: "Tym successfully", newMessage });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};

module.exports = chatCtrl;
