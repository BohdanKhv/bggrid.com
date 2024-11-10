const mongoose = require('mongoose');

const tagsEnum = ['owned', 'wishlist', 'favorite', 'played', 'want-to-play']

const librarySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Game'
    },
    tags: {
        type: [String],
        enum: tagsEnum,
        default: ['owned']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 200
    },
}, {
    timestamps: true
});


const Library = mongoose.model('Library', librarySchema);