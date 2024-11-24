const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    user1: { // the user who sent the friend request
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user2: { // the user who received the friend request
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    pending: {
        type: Boolean,
        required: false,
        default: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Friend', friendSchema);