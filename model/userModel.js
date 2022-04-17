const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'male'
    },
    mobile: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    followers: [{type: mongoose.Types.ObjectId, ref: 'users'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'users'}],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('users', userSchema)