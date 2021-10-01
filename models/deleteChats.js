const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema;
const deleteChatModel = new Schema({
    userId: {
        type: ObjectId,
        ref: 'users'
    },
    chatId: {
        type: ObjectId,
        ref: 'chats'
    }
}, { timestamps: true });
const deleteChats = mongoose.model('deletechats', deleteChatModel);
module.exports = deleteChats;