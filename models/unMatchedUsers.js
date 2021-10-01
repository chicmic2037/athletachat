const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId
const UnMatchedUserModel = new Schema({
    unMatched: {
        type: ObjectId,
        ref: 'users'
    },
    unMatchedBy: {
        type: ObjectId,
        ref: 'users'
    },
    chatId:{
        type: ObjectId,
        ref: 'chats'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const UnMatchedUser = mongoose.model('unmatchedusers', UnMatchedUserModel);
module.exports = UnMatchedUser;
