const mongoose = require('mongoose');


const publisherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    website: {
        type: String,
        required: false,
        trim: true
    },
    logo: {
        type: String,
        required: false,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    bggId: {
        type: String,
        required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Publisher', publisherSchema);
