
module.exports = {
    socialLogin: {
        _id: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
        phone: 1,
        countryCode: 1,
        image: 1,
        authToken: 1,
        status: 1
    },
    getQuestions: {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    },
    home: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        image: 1,
        age: 1,
        location: "$location.name"
    },
    profile: {
        _id: 1,
        image: 1,
        firstName: 1,
        lastName: 1,
        gender: 1,
        age: 1,
        height: 1,
        ethinicity: 1,
        belief: 1,
        location: 1,
        relationshipStatus: 1,
        gallery: 1
    },
    other_profile: {
        _id: 1,
        image: 1,
        firstName: 1,
        lastName: 1,
        gender: 1,
        age: 1,
        height: 1,
        ethinicity: 1,
        belief: 1,
        location: 1,
        relationshipStatus: 1,
        gallery: 1,
        rating: '$rating.overallRating.value'
    },
    matches: {
        _id: 1,
        user: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1
        }
    },
    getChats: {
        _id: 1,
        user1: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1
        },
        user2: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1
        }
    },
    getChat: {
        _id: 1,
        sender: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1
        },
        reciever: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            image: 1
        },
        type: 1,
        uploads: 1,
        text: 1,
        createdAt: 1,
        isReaded: 1
    }
}