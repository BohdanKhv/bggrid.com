const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const tagsEnum = ['Favorite', 'Own', "Prev. Owned", 'Wishlist', 'Played', 'Want to Play', 'For Trade', 'Want in Trade', 'Preordered'];

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
        required: false,
    },
    rating: {
        type: Number,
        required: false,
        default: 0,
    },
    comment: {
        type: String,
        required: false,
        maxlength: 500
    },
    totalPlayTime: {
        type: Number,
        required: false,
        default: 0,
    },
    totalPlays: {
        type: Number,
        required: false,
        default: 0,
    },
    totalWins: {
        type: Number,
        required: false,
        default: 0,
    },
    lastPlayDate: {
        type: Date,
        required: false,
    }
}, {
    timestamps: true
});


librarySchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Library', librarySchema);