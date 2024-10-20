const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        max: 20
    },
    content: {
        type: String,
        required: true,
        max: 300
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);