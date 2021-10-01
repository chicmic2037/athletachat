const mongoose = require('mongoose');
const { ENUMS } = require('../constants');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId
const ChatMessageModel = new Schema({
    type: {
        type: String,
        enum: ENUMS.MESSAGE_TYPES
    },
    sender: {
        type: ObjectId,
        required: false
    },
    reciever: {
        type: ObjectId,
        required: true
    },
    text: {
        type: String
    },
    uploads: {
        path: { type: String },
        thumbnail: { type: String }
    },
    chatId: {
        type: Schema.Types.ObjectId,
        ref: "chats",
    },
    isReaded: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const ChatMessage = mongoose.model('Chatmessages', ChatMessageModel);
module.exports = ChatMessage;
