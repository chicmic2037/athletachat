const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId
const BlockedUserModel = new Schema({
    blocked: {
        type: ObjectId,
        ref: 'users'
    },
    blockedBy: {
        type: ObjectId,
        ref: 'users'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const BlockedUser = mongoose.model('blockedusers', BlockedUserModel);
module.exports = BlockedUser;
