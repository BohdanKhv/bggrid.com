const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower: { // the user who is following
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    following: { // the user who is being followed
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

const follow = mongoose.model('Follow', followSchema);

module.exports = follow;