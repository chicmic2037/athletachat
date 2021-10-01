const config = require('config')
module.exports = {
    CODES: require('./codes'),
    MESSAGES: require('./messages'),
    LANGS: require('./langs'),
    TIMEZONE: "+05:30",
    REGEX: {
        EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        PHONE: /^[0-9]+$/,
        COUNTRY_CODE: /^[0-9,+]+$/,
        PASSWORD: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? " + "])[a - zA - Z0 - 9!#$ %&?]{ 8, 20 } $ /
    },
    ENUMS: {
        RATINGS: [
            0, // DEFAULT
            1, // TERRIBLE
            2, // POOR
            3, // AVERAGE
            4, // VERY GOOD
            5  // EXCELLENT
        ],
        RATING_TYPES: [
            0, // CHAT
            1  // DATE
        ],
        MESSSAGE_TYPES: [
            0, // TEXT
            1, // VIDEO
            2, // AUDIO
            3, // DOC
            4  // IMAGE
        ],
        DEVICES: [
            0, // ANDROID
            1, // IOS
            2  // WEB
        ],
        USER_TYPES: [
            0, // ADMIN
            1, // SUB-ADMIN
            2  // APP USER
        ],
        OTP_TYPES: [
            0, // SIGNUP
            1, // FORGOT
        ],
        LOGIN_TYPES: [
            1, // NORMAL
            2, // GOOGLE
            3, // APPLE
            4, // FACEBOOK
            5  // LINKEDIN
        ],
        PROFILE_STATUS: [
            0, // LOGGEDIN
            1, // PREFERENCES SET
            2, // QUESTIONS ANSWERED
            3, // PROFILE COMPLETED
        ],
        GENDER: [
            1, // MAN
            2, // WOMAN
            3, // TRANS MAN
            4, // TRANS WOMAN
            5, // NON-BINARY
        ],
        ETHINICITY: [
            1, // ANY
            2, // AMERICAN_INDIAN_OR_ALASKA_NATIVE
            3, // ASIAN
            4, // BLACK_OR_AFRICAN_AMERICAN
            5, // HISPANIC_OR_LATINO
            6, // NATIVE_HAWAIIAN_OR_OTHER_PACIFIC_ISLANDER
            7, // WHITE
            8, // EUROPIAN
            9, // INDIAN
            10, // OTHER
        ],
        BELIEF: [
            1, // ANY
            2, // AGNOSTIC
            3, // ATHEIST
            4, // BUDDHIST
            5, // CHRISTIAN
            6, // HINDU
            7, // JEWISH
            8, // SPIRITIAL
            9, // NONE
        ],
        QUESTION_TYPES: [
            1, // CHOICE
            2, // TEXT
            3  // MULTIPLE
        ],
        RELATIONSHIP_STATUS: [
            1, // SINGLE
            2, // SEPERATED
            3  // DIVORCED 
        ],
        BODY_TYPES: [
            1, // Slender
            2, // Average
            3, // Afew extra pounds
            4, // Curvy
            5, // Heavyset (Stocky)
            6, // Full Figured
            7  // Athletic & Toned
        ]
    },
    PREFERENCES: {
        GENDER: {
            1: 'A man',
            2: 'A woman',
            3: 'Trans man',
            4: 'Trans Woman',
            5: 'Non Binary'
        },
        ETHINICITY: {
            1: 'Any',
            2: 'American Indian or Alaska Native',
            3: 'Asian',
            4: 'Black or African American',
            5: 'Hispanic or Latino',
            6: 'Native Hawaiian or Other Pacific Islander',
            7: 'White',
            8: 'European',
            9: 'Indian',
            10: 'Other',
        },
        BELIEF: {
            1: 'Any',
            2: 'Agnostic',
            3: 'Atheist',
            4: 'Buddhist',
            5: 'Christian',
            6: 'Hindu',
            7: 'Jewish',
            8: 'Spiritual',
            9: 'None'
        },
        RELATIONSHIP_STATUS: {
            1: 'Single',
            2: 'Separated',
            3: 'Divorced'
        }
    },
    OTP_OPTIONS: {
        LENGTH: 5,
        EXPIRES: 5,
        IN: "minutes"
    },
    EMAIL_SERVICE: {
        USING: config.get('EMAIL_SERVICE'), // 0:NODE_MAILER   1:SENDGRID
        NODE_MAILER: {
            EMAIL: "gagandeep.apptunix@gmail.com",
            PASSWORD: "54321@ASDFg"
        },
        SEND_GRID: {
            EMAIL: "gagandeep.apptunix@gmail.com",
        },
        SUBJECTS: {
            REMINDER: "Booking Tommorow"
        }
    },
    PATHS: {
        IMAGE: {
            ADMIN: {
                ACTUAL: "/uploads/images/admin/",
                STATIC: "/admin/profile/image/"
            }
        },
        FILE: {
            ADMIN: {
                ACTUAL: "/uploads/files/driver/",
                STATIC: "/driver/profile/document/"
            }
        }
    }
}