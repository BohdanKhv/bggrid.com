const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    friend: {
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