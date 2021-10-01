const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema;
const MatchingModel = new Schema({
    userId: {
        type: ObjectId,
        ref: 'users'
    },
    matchedUserId: {
        type: ObjectId,
        ref: 'users'
    },
    status: {
        type: Number,
        enums: [
            0, // Like
            1, // UnMatched (Reject)
            2, // Matched from both Sides
            3, // Accept Match
        ]
    }
}, { timestamps: true });
const Matching = mongoose.model('matchings', MatchingModel);
module.exports = Matching;