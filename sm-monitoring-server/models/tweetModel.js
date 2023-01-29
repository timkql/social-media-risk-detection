const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    id: {
        required: true,
        type: String
    },
    tag: {
        required: true,
        type: String
    },  
    text: {
        required: true,
        type: String
    },
    image: {
        required: false,
        type: String
    },
    URL: {
        required: true,
        type: String
    },
    label: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('tweet', dataSchema)