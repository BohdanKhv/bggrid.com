const mongoose = require('mongoose');

const typesEnum = ['library', 'friendRequest', 'play', 'system'];


const notificationSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: false
    },
    library: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Library',
        required: false
    },
    play: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Play',
        required: false
    },
    friendRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friend',
        required: false
    },
    type: {
        type: String,
        required: true,
        enum: typesEnum
    },
}, { timestamps: true });


module.exports = mongoose.model('Notification', notificationSchema);