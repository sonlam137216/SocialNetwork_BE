const mongoose = require('mongoose')
const Schema = mongoose.Schema
const users = require('../model/userModel')

const postSchema = new Schema({
    content: String,
    images: {
        type: Array,
        required: true
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
    user: {type: mongoose.Types.ObjectId, ref: 'users'},
    createdAt: {
      type: Date,
      default: Date.now
    }
})

module.exports = mongoose.model('posts', postSchema)