const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    conversationId: { type: mongoose.Types.ObjectId, ref: 'convaersations' },
    sender: { type: mongoose.Types.ObjectId, ref: 'users' },
    content: {
        isImage: {
            type: Boolean,
            default: false,
        },
        text: {
            type: String,
            required: true,
        },
    },
    tym: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model('messages', messagesSchema);
