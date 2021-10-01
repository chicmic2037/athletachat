const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId
const ChatModel = new Schema({
    user1: {
        type: ObjectId,
        ref: 'users'
    },
    user2: {
        type: ObjectId,
        ref: 'users'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const Chat = mongoose.model('Chats', ChatModel);
module.exports = Chat;
