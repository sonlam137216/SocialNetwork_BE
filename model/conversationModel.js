const mongoose = require('mongoose')
const Schema = mongoose.Schema
const users = require('../model/userModel')
const posts = require('../model/postModel')

const conversationSchema = new Schema({
    name: {
        type: String,
        default: '',
    },
    members: [{type: mongoose.Types.ObjectId, ref: 'users'}],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('conversations', conversationSchema)