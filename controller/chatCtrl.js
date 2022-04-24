const Post = require('../model/postModel');
const User = require('../model/userModel');
const Conversation = require('../model/conversationModel');
const Mess = require('../model/messageModel');


const chatCtrl = {
    createConversation: async (req, res) => {
        const { usersId } = req.body;

        usersId.push(req.userId);

        //simple validation
        // if (!name)
        //   return res
        //     .status(400)
        //     .json({ success: false, message: 'name is required' });

        try {
            const newConversation = new Conversation({
                name: 'test',
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
            }).sort({ createdAt: -1 });

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
        const {mess} = req.body

        try {
            const newMessage = new Mess({
                sender: req.userId,
                conversationId: req.body.conversationId,
                content: req.body.content,
            });
    
            await newMessage.save()

            const conversation = await Conversation.findOneAndUpdate(
                { _id: newMessage.conversationId },
                {
                    lastMessageAt: newMessage.createAt
                }
            )

            res.json({ success: true, message: 'save message', newMessage });
            //socket.emit('sendMessage', newMessage)

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }        
    },

    getMessageInConversation: async (req, res) => {
        try {
            const messages = await Mess.find({
                conversationId: req.body
            }).populate({path: 'users'});

            res.json({ success: true, message: 'messages by conversation Id', messages });
            //socket.emit('sendMessage', newMessage)

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        } 
    }
};

module.exports = chatCtrl;
