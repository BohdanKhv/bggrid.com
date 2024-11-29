const mongoose = require('mongoose');

const typesEnum = ['library', 'friendRequest', 'play', 'system'];


const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    link: { 
        type: String,
        required: false
    },
    linkText: {
        type: String,
        required: false
    },
    read: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        required: true,
        enum: typesEnum
    },
}, { timestamps: true });


module.exports = mongoose.model('Notification', notificationSchema);