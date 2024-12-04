const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9]+$/,
            'Please add a valid username'
        ],
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
    },
    isGoogleOauth: { type: Boolean, required: false, default: false },
    password: {
        type: String,
        required: false, // Because we are using OAuth for login and registration from google
        select: false,
    },
    firstName: { type: String, required: false, trim: true },
    lastName: { type: String, required: false, trim: true },
    bio: { type: String, required: false },
    gender: { type: String, required: false },
    birthDate: { type: Date, required: false },
    avatar: { type: String, required: false }, // url to avatar uploadable
    bggUsername: { type: String, required: false, trim: true },

    lastLogin: { type: Date, required: false, default: Date.now },
    active: { type: Boolean, required: false, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);