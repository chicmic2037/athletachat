const { ENUMS } = require('../constants');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = new Schema({
    image: {
        type: String,
        default: '/user/profile/image/default.jpg'
    },
    firstName: {
        type: String,
        default: "",
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        default: "",
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    countryCode: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        default: ''
    },
    location: {
        type: {
            type: String
        },
        coordinates: [{ type: Number }],
        name: { type: String }
    },
    type: {
        type: Number,
        enum: ENUMS.USER_TYPES
    },
    deviceType: {
        type: Number,
        enum: ENUMS.DEVICES,
        required: true
    },
    deviceToken: {
        type: String,
        default: ''
    },
    deviceId: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    authToken: {
        type: String,
        default: ''
    },
    loginType: {
        type: Number,
        enum: ENUMS.LOGIN_TYPES
    },
    preferences: {
        type: Object,
        ref: 'preferences'
    },
    appleId: {
        type: String
    },
    googleId: {
        type: String
    },
    linkedInId: {
        type: String
    },
    facebookId: {
        type: String
    },
    status: {
        type: Number,
        enum: ENUMS.PROFILE_STATUS,
        default: 0
    },
    gender: {
        type: Number,
        enums: ENUMS.GENDER
    },
    age: {
        type: Number
    },
    ethinicity: [{
        type: Number,
        enums: ENUMS.ETHINICITY
    }],
    belief: {
        type: Number,
        enums: ENUMS.BELIEF
    },
    height: {
        type: Number,
    },
    rating: {
        overallRating: {
            count: {
                type: Number,
                default: 0
            },
            value: {
                type: Number,
                enums: ENUMS.RATINGS,
                default: 0
            }
        },
        goodListener: {
            count: {
                type: Number,
                default: 0
            },
            value: {
                type: Number,
                enums: ENUMS.RATINGS,
                default: 1
            }
        },
        responseTime: {
            count: {
                type: Number,
                default: 0
            },
            value: {
                type: Number,
                enums: ENUMS.RATINGS,
                default: 1
            }
        },
        behavior: {
            count: {
                type: Number,
                default: 0
            },
            value: {
                type: Number,
                enums: ENUMS.RATINGS,
                default: 1
            }
        },
        punctuality: {
            count: {
                type: Number,
                default: 0
            },
            value: {
                type: Number,
                enums: ENUMS.RATINGS,
                default: 1
            }
        },
        communication: {
            count: {
                type: Number,
                default: 0
            },
            value: {
                type: Number,
                enums: ENUMS.RATINGS,
                default: 1
            }
        },
        pics: {
            count: {
                type: Number,
                default: 0
            },
            value: {
                type: Number,
                enums: ENUMS.RATINGS,
                default: 1
            }
        },
        praiseExpression: {
            count: {
                type: Number,
                default: 0
            },
            value: {
                type: Number,
                enums: ENUMS.RATINGS,
                default: 1
            }
        }
    },
    relationshipStatus: {
        type: Number,
        enums: ENUMS.RELATIONSHIP_STATUS
    },
    gallery: [{ type: String }],
    bodyType: {
        type: Number,
        enums: ENUMS.BODY_TYPES
    }
}, { timestamps: true });
UserModel.index({ email: 1, phone: 1 })
const User = mongoose.model('users', UserModel);
module.exports = User;