const mongoose = require('mongoose');

const tagsEnum = ['Favorite', 'Owned', 'Wishlist', 'Played', 'Want to Play']

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
        default: ['favorite']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    comment: {
        type: String,
        maxlength: 500
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Library', librarySchema);