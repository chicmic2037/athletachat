const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId
const ChatModel = new Schema({
    user1: {
        type: ObjectId
    },
    user2: {
        type: ObjectId
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const Chat = mongoose.model('Chats', ChatModel);
module.exports = Chat;
