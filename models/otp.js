const { ENUMS } = require('../constants');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema;
const OtpModel = new Schema({
    expiredAt: {
        type: Date
    },
    link: {
        type: String
    },
    code: {
        type: Number
    },
    type: {
        type: String,
        enum: ENUMS.OTP_TYPES
    },
    userId: {
        type: ObjectId
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    countryCode: {
        type: String
    }
}, { timestamps: true });
const Otp = mongoose.model('otps', OtpModel);
module.exports = Otp;