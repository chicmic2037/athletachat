const CONSTANTS = require('../../constants')
module.exports = {
    getUsers: {
        _id: 1,
        image: 1,
        firstName: 1,
        lastName: 1,
        rating: "$rating.overallRating.value",
        age: 1,
        gender: 1,
        plan: "Standard"
    }
}