const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    id: {
        required: true,
        type: String
    },
    firstName: {
        required: true,
        type: String
    },  
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    usernames: {
        required: true,
        type: [String]
    }
})

module.exports = mongoose.model('users', dataSchema)