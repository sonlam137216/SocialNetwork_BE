const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const users = require('../model/userModel');
const posts = require('../model/postModel');

const notificatonSchema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId, ref: 'users'
    },
    receiver: { 
        type: mongoose.Types.ObjectId, ref: 'users' 
    },
    notiType: {
        type: Number,
        default: '',
    },
    desId: {
        type: mongoose.Types.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('notifications', notificatonSchema);
