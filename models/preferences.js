const mongoose = require('mongoose');
const { ENUMS } = require('../constants');
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema;
const PreferencesModel = new Schema({
    userId: {
        type: ObjectId,
        ref: 'users'
    },
    gender: [{
        type: Number,
        enums: ENUMS.GENDER
    }],
    ethinicity: [{
        type: Number,
        enums: ENUMS.ETHINICITY
    }],
    belief: [{
        type: Number,
        enums: ENUMS.BELIEF
    }],
    minHeight: {
        type: Number
    },
    maxHeight: {
        type: Number
    },
    minAge: {
        type: Number
    },
    maxAge: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const Preferences = mongoose.model('preferences', PreferencesModel);
module.exports = Preferences;