const mongoose = require('mongoose')
const Schema = mongoose.Schema
const users = require('../model/userModel')
const posts = require('../model/postModel')

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    tag: [{type: mongoose.Types.ObjectId, ref: 'users'}],
    reply: [{type: mongoose.Types.ObjectId, ref: 'comments'}],
    parent: String,
    likes: [{type: mongoose.Types.ObjectId, ref: 'users'}],
    user: {type: mongoose.Types.ObjectId, ref: 'users'},
    postId: {type: mongoose.Types.ObjectId, ref: 'posts'},
    postUserId: {type: mongoose.Types.ObjectId, ref: 'users'}
},  {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

module.exports = mongoose.model('comments', commentSchema)

