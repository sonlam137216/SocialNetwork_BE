const Post = require('../model/postModel');
const User = require('../model/userModel');
const Conversation = require('../model/conversationModel');
const Mess = require('../model/messageModel');

const chatCtrl = {
    createConversation: async (req, res) => {
        const { users } = req.body;

        const usersId = users.map((user) => user._id);

        usersId.push(req.userId);

        try {
            const newConversation = new Conversation({
                members: usersId,
            });

            await newConversation.save();

            res.json({ success: true, message: 'new conversation has created', newConversation });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Interal server error' });
        }
    },

    getConversations: async (req, res) => {
        try {
            const conversation = await Conversation.find({
                members: req.userId,
            }).sort({ updatedAt: -1 });

            if (!conversation) {
                res.status(404).json({ error: 'not found' });
                return;
            }

            res.json({ success: true, conversation });
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    },

    addMember: async (req, res) => {
        const { usersId } = req.body;

        //simple validation
        if (!usersId) return res.status(400).json({ success: false, message: '0 user' });

        try {
            const conversation = await Conversation.find({
                _id: req.params.conId,
            }).exec();

            //   if (user.length!=0)
            //     return res
            //       .status(400)
            //       .json({ success: true, message: 'You have followed this user!' });

            const addUser = await Conversation.findOneAndUpdate(
                { _id: req.params.conId },
                { $push: { members: usersId } },
                { new: true }
            );

            res.json({ success: true, message: 'add user successful', usersId });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
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
                    isImage: req.body.isImage,
                },
            });

            await newMessage.save();
            const newBruh = await newMessage.populate({ path: 'sender' });

            const conversation = await Conversation.findOneAndUpdate(
                { _id: newMessage.conversationId },
                {
                    updatedAt: Date.now(),
                }
            );

            res.status(201).json({ success: true, message: 'save message', newMessage: newBruh });
            //socket.emit('sendMessage', newMessage)
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    getMessageInConversation: async (req, res) => {
        try {
            const messages = await Mess.find({
                conversationId: req.params.id,
            }).populate({ path: 'sender' });
            res.status(200).json({ success: true, message: 'messages by conversation Id', messages });
            //socket.emit('sendMessage', newMessage)
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    getExistConversation: async (req, res) => {
        const { users } = req.body;
        const usersId = users.map((user) => user._id);
        try {
            const conversation = await Conversation.find({
                $and: [{ members: { $all: userId } }, { members: { $size: usersId.length } }],
            });
            S;

            res.status(200).json({ success: true, message: 'existed conversation', conversation });
            //socket.emit('sendMessage', newMessage)
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    getMembersConversation: async (req, res) => {
        try {
            const conversation = await Conversation.findOne({
                _id: req.params.id,
            }).populate({ path: 'members' });
            res.status(200).json({ success: true, message: 'existed conversation', members: conversation.members });
            //socket.emit('sendMessage', newMessage)
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    removeConversation: async (req, res) => {
        try {
            const { conversationId } = req.body;
            const conversation = await Conversation.findOneAndDelete({
                _id: conversationId,
            });

            res.json({ success: true, message: 'existed conversation', conversation });
            //socket.emit('sendMessage', newMessage)
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    tymMessage: async(req, res) => {
        try {
            const { userId } = req.body.userId;
            const { messageId } = req.body.messageId;
            const message = await Mess.findOneAndUpdate(
                {_id: messageId},
                {
                     $push: { tym: usersId },
                },
                { new: true }
            );

            res.json({ success: true, message: 'existed conversation', message });
            //socket.emit('sendMessage', newMessage)
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
};

module.exports = chatCtrl;
