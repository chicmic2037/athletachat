const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChatModel = new Schema({
    user1: {
        type: Number
    },
    user2: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    lastMessage: {
        type: String,
        default: ""
    },
    lastMessageTime: {
        type: Date
    }
}, { timestamps: true });
const Chat = mongoose.model('Chats', ChatModel);
module.exports = Chat;
