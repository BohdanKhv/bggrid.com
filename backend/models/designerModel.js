const mongoose = require('mongoose');


const designerSchema = new mongoose.Schema({
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
    bggId: {
        type: Number,
        required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Designer', designerSchema);
