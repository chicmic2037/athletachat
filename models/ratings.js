const { ENUMS } = require('../constants');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId
const RatingModel = new Schema({
    type: {
        type: Number,
        enums: ENUMS.RATING_TYPES
    },
    chatId: {
        type: ObjectId,
        ref: 'chats'
    },
    rated: {
        type: ObjectId,
        ref: 'users'
    },
    ratedBy: {
        type: ObjectId,
        ref: 'users'
    },
    comment: {
        type: String
    },
    goodListener: {
        type: Number,
        enums: ENUMS.RATINGS
    },
    responseTime: {
        type: Number,
        enums: ENUMS.RATINGS
    },
    behavior: {
        type: Number,
        enums: ENUMS.RATINGS
    },
    punctuality: {
        type: Number,
        enums: ENUMS.RATINGS
    },
    communication: {
        type: Number,
        enums: ENUMS.RATINGS
    },
    pics: {
        type: Number,
        enums: ENUMS.RATINGS
    },
    praiseExpression: {
        type: Number,
        enums: ENUMS.RATINGS
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const Rating = mongoose.model('Ratings', RatingModel);
module.exports = Rating;
