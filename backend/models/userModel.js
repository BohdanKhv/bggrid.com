const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
    },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    bio: { type: String, required: false },
    gender: { type: String, required: false },
    birthDate: { type: Date, required: false },
    avatar: { type: String, required: false }, // url to avatar uploadable

    lastLogin: { type: Date, required: false, default: Date.now },
    active: { type: Boolean, required: false, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);