const mongoose = require('mongoose');


const followSchema = new mongoose.Schema({
    // user who is following
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // user who is being followed
    following: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true });


module.exports = mongoose.model('Follow', followSchema);
