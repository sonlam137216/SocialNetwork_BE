const mongoose = require('mongoose')
const Schema = mongoose.Schema
const users = require('../model/userModel')
const posts = require('../model/postModel')

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    tag: Object,
    reply: [{type: mongoose.Types.ObjectId, ref: 'comments'}],
    likes: [{type: mongoose.Types.ObjectId, ref: 'users'}],
    user: {type: mongoose.Types.ObjectId, ref: 'users'},
    postId: {type: mongoose.Types.ObjectId, ref: 'posts'},
    postUserId: {type: mongoose.Types.ObjectId, ref: 'users'}
})
module.exports = mongoose.model('comments', commentSchema)