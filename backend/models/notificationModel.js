const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
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
    linkTo: {
        type: String,
        required: true
    },
    linkTitle: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Notification', notificationSchema);